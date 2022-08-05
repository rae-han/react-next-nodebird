module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', // 이모티콘 저장
  });

  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    // 해시태그가 골치 아픈게 하나의 해시태그에 게시글이 여러개 있을수도
    // 게시글에 해시태그가 여러개 있을수도 있다.
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // 좋아요.
    // User와 Post의 관계가 2개라서 헷갈릴수 있는데 이럴땐 as를 쓴다.
    // 나중에 as에 따라서 post.getLikers처럼 게시글 좋아요 누른 사람을 가져오게 된다.
    // db 유저에 대한 이름을 바꿔준다.
    // #
    // 추가로 관계 메서드를 적어두면 post.addLikers post.removeLikers 처럼 쉽게 사용 가능한 메서드가 체이닝된다. s는 many라 붙는다.
    // add remove get set 이 있다.
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // retweet 이렇게 하면 content아래 들어가는 키 이름이 postId에서 retweetId로 바뀐다.
    // post 테이블이 id1234 가 있고 234가 1을 리트윗 햇다면 1~4까지 retweet 기준 null 1 1 1 이 들어가 있다.
  };
  return Post;
}