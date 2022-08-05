const express = require('express');
const { Op } = require('sequelize')

const { Post, User, Image, Comment } = require('../models')

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { lastId, limit } = req.query;
    const where = {};

    if(parseInt(lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(lastId, 10) }; // id가 lastId보다 작은 10개
    }

    const posts = await Post.findAll({
      where,
      limit: 10, // 최대 10개씩 들고 와라.
      // offset: 0,  // 0번 부터 게시글을 가져와라.
      // limit offset은 실무에서 잘 안쓴다.
      // 최신 글 부터 보여줄 때, 중간에 사람이 게시글을 하나 더 쓰며ㅑㄴ 하나씩 뒤로 밀려서 중간 걸 또 불려와 겹칠수도 있다.
      // 또는 누군가 지우면 안들고 오는 게시글이 있을 수 있다.
      // 그래서 offset, lastId를 쓴다. lastId는 개발자가 구현한 것
      // where: { id: lastId },
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'] // 댓글 정렬은 Commnet에서 해주는 것이 아니라 여기에서.
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }]
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model:User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }]
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;