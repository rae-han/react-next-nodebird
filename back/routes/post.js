const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { Post, Comment, Image, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares')

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.error(error);
  console.log('uploads 폴더가 없어서 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({ // json, form data 와 다르게 전체에 적용하지 않고 부분부분 필요한 유형으로 넣어준다.
  storage:multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      // 노드는 같은 파일 이름이 있을때 기본적으로 덮어씌운다.
      // path는 노드 기본 모듈
      const ext = path.extname(file.originalname); // 확장자(.ext)
      const basename = path.basename(file.originalname, ext); // 파일 이름 꺼내오기
      done(null, basename + new Date().getTime() + ext); // filename15184712345.ext
    }
  }),
  limits: { fileSize: 20 * 1024 *1024 }, // 20MB
})
// 컴퓨터 하드디스크에 저장하면 스케일링 할 때 이미지도 같이 복사해줘야 해서 서버에 쓸데없는 공간을 잡아먹는다.
// 나중에 aws s3 같은걸로 대체한다.

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // 로그인 했기 때문에 정보가 들어가 있다. // deserializerUser
    })

    if(hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ // 있으면 찾고 없으면 등록 다만 where을 붙어야한다.
        where: { name: tag.slice(1).toLowerCase() },
      })));
      // -> [[노드, true], [익스프레스, true]]
      await post.addHashtags(result.map((v) => v[0]));
    }

    if(req.body.image) {
      if(Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImage(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
      }, {
        model: Comment
      }, {
        model: User,
        attributes: ['id', 'nickname']
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }]
    })

    return res.status(201).json(fullPost)
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.get('/:postId', isLoggedIn, async (req, res, next) => {
router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(404).send('존재하지 않는 게시글 입니다.');
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model:User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname']
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }]
      }]
    })

    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  // 주소에서 동적으로 바뀌는건 파라미터이다.
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId }
    })

    if(!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.')
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    })

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname']
      }]
    })

    return res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  // 주소에서 동적으로 바뀌는건 파라미터이다.
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include:[{ // 이걸 써주는게 좋다.
        model: Post,
        as: 'Retweet',
      }]
    })

    if(!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.')
    }

    if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) { // 자기 글 리트윗 하는 것과 자기 글을 리트윗 한 글을 리트윗 하는 것을 막는다.
      return res.status(403).send('자신의 글을 리트윗할 수 없습니다.');
    }

    const retweetTargetId = post.RetweetId || post.id;
    // 어떤 아이디를 리트윗 할거냐
    // 남의 글을 리트윗 한것을 또 리트윗 할 수 있는데 리트윗 했다면 그 아이디를 쓰고 그게 아니면 포스트 아이디를 리트윗한다.
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if(exPost) {
      return res.status(403).send('이미 리트윗했습니다.')
    }

    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    })

    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model:User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname']
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }]
      }]
    })

    return res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }})
    if(!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.')
    }

    await post.addLikers(req.user.id); // models/post #2 참조

    res.status(200).json({ PostId: post.id, UserId: req.user.id })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }})
    if(!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.')
    }

    await post.removeLikers(req.user.id); // models/post #2 참조

    res.status(200).json({ PostId: post.id, UserId: req.user.id })
  } catch (error) {
    console.error(error)
    next(error)
  }
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
  // image input으로 올린게 전달된다.
  // array인 이유는 이미지를 여러장 올리기 위해, 한장은 single, 필요 없다면  none, fills는 인풋이 두개 이상 있을
  // 미들웨어에서 이미 올려 준 후에 이 부분이 실행되므로 req.files를 통해 참조 가능하다.
  // console.log(req.files);
  res.json(req.files.map((file) => file.filename))
});

module.exports = router;