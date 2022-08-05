const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport');

const { User, Post, Image, Comment } = require('../models'); // db.User에 접근
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

router.get('/', async (req, res, next) => {
  // console.log(req.headers)
  try {
    if(req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        // attributes: [], // attributes 프로퍼티를 통해 받을 것을 정해줄수 있다.
        attributes: { // exclude라는 특별한 키워드를 통해 뺄 것을 정해줄 수 있다.
          exclude: ['password'],
        },
        include: [{
          // associate에 적힌 그대로 적으면 된다.
          model: Post, //  hasMany라 model: Post가 복수형이 되어 me.Posts가 된다.
          attributes: ['id'], // id만 알아도 몇개인지 셀 수 있다.
        }, { // as가 있는 것들은 as에 담겨있는 값을 적으면 된다.
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      })
      // const user = await User.findOne({
      //   where: { id: req.user.id }
      // });

      res.status(200).json(fullUserWithoutPassword)
    } else {
      res.status(200).json(null)
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:id/posts', async (req, res, next) => { // GET /user/1/posts
  console.log('/user/:id/posts')
  try {
    const user = await User.findOne({ where: { id: req.params.id }});
    if (user) {
      const where = {};
      if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
      } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
      const posts = await user.getPosts({
        where,
        limit: 10,
        include: [{
          model: Image,
        }, {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }]
        }, {
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: User,
          through: 'Like',
          as: 'Likers',
          attributes: ['id'],
        }, {
          model: Post,
          as: 'Retweet',
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }, {
            model: Image,
          }]
        }],
      });
      console.log(posts);
      res.status(200).json(posts);
    } else {
      res.status(404).send('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: { // where가 조건
        email: req.body.email,
      }
    });

    if(exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
      // return 을 안붙이면 위 아래 다 보내가 되고
      // 헤더는 한번 밖에 보낼수 없다는 can't set headers already sent 에러가 뜬다.
      // status로 헤더를 보낼 수 있따.
      // 요청 / 응답 은
      // 헤더 (상태, 용량, 시간, 쿠키)와
      // 바디(데이터)로 구성돼 있다.
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10); // salt로 보통 10~13을 넣는다. 해쉬화. 1초정도 걸리는 걸로 맞춘다고 한다.
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword
    });

    res.status(200).json('ok');
  } catch (e) {
    console.error(e);
    next(e); // 여기서 에러 나면 500 뜬다.
  }
});

// router.post('/login', (req, res, next) => {})
// router.post('/login', passport.authenticate('local', (err, user, info) => { // 차례대로 서버에러, 성곡객체, 인포
//   if(err) { // 첫 번째는 서버 에러
//     console.error(err);
//     // next(err); // 여기는 next, res 가 없다.
//   }
// })); // ㅇㅣ렇게 하면 로컬 전략이 실행된다.
router.post('/login', isNotLoggedIn, (req, res, next) => {
  console.log('/user/login')
  passport.authenticate('local', (err, user, info) => { // 차례대로 서버에러, 성곡객체, 클라이언트 에러
    if(err) { // 첫 번째는 서버 에러
      console.error(err);
    }
    if(info) {
      console.error(info)
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => { // 이게 진짜 로그인, passport에서 로그인 할수 있게 허락해준 것, 우리 서비스 로그인 다 끝나고 패스포트 한번 더
      if(loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // attributes: [], // attributes 프로퍼티를 통해 받을 것을 정해줄수 있다.
        attributes: { // exclude라는 특별한 키워드를 통해 뺄 것을 정해줄 수 있다.
          exclude: ['password'],
        },
        include: [{
          // associate에 적힌 그대로 적으면 된다.
          model: Post, //  hasMany라 model: Post가 복수형이 되어 me.Posts가 된다.
        }, { // as가 있는 것들은 as에 담겨있는 값을 적으면 된다.
          model: User,
          as: 'Followings',
        }, {
          model: User,
          as: 'Followers',
        }]
      })

      // 내부적으로 res.setHeader('Cookie', 'asdfg') 이런거 보내준다.
      return res.status(200).json(fullUserWithoutPassword);
    })
  })(req, res, next); // 이렇게 하면 미들웨어가 확장된다.
});

router.post('/logout', isLoggedIn, (req, res, next) => {
  console.log('/user/logout')
  // return req.logout(() => res.redirect('/'));
  req.logout();
  // 이런 식으로 콜백 함수를 제공하고 그 안에서 응답해야한다.
  // passport@0.6이 되면서 로그인할 때마다 세션 쿠키가 변경되고 로그아웃할 때에도 세션 쿠키가 정리되는 것 같다.
  req.session.destroy();
  res.status(200).send('ok');
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({
      nickname: req.body.nickname, // 무엇을 바꿀지
    }, {
      where: { id: req.user.id }, // 누구를 바꿀지
    })

    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id }});
    if(!user) {
      res.status(403).send('');
    }

    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id }});
    if(!user) {
      res.status(403).send('');
    }

    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId }});
    if(!user) {
      res.status(403).send('없는 사람을 팔로우 하려고 합니다.')
    }

    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId }});
    if(!user) {
      res.status(403).send('없는 사람을 언팔로우 하려고 합니다.')
    }

    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    // const user = await User.findOne({ where: { id: req.user.id }});
    // if(!user) {
    //   res.status(403).send('존재하지 않는 유저');
    // }
    //
    // await user.removeFollowers(req.params.userId)

    // follower와 followering은 서로 대칭 관계이기 때문에 반대로 하면 아래와 같ㄷ.

    const user = await User.findOne({ where: { id: req.params.userId }});
    if(!user) {
      res.status(403).send('존재하지 않는 유저');
    }

    await user.removeFollowings(req.user.id)
    res.status(200).json({ UserId: parseInt(req.params.userId, 10)})
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.get('/:userId', async (req, res, next) => {
  console.log(req.headers)
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      // attributes: [], // attributes 프로퍼티를 통해 받을 것을 정해줄수 있다.
      attributes: { // exclude라는 특별한 키워드를 통해 뺄 것을 정해줄 수 있다.
        exclude: ['password'],
      },
      include: [{
        // associate에 적힌 그대로 적으면 된다.
        model: Post, //  hasMany라 model: Post가 복수형이 되어 me.Posts가 된다.
        attributes: ['id'], // id만 알아도 몇개인지 셀 수 있다.
      }, { // as가 있는 것들은 as에 담겨있는 값을 적으면 된다.
        model: User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id'],
      }]
    })

    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON(); // 시퀄라이저에서 온 데이터는 JSON이 아니라 우리가 쓸수 있는 JSON으로 바꿔줘야 한다.
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data)
    } else {
      res.status(404).send('존재하지 않는 사용자입니다.')
    }


  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;