module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // 이렇게 하면 mysql에서는 소문자 + 복수로 저장된다 User => users
    // id 값은 기본적으로 들어간다.
    email: {
      type: DataTypes.STRING(30),
      allowNull: false, // 필수
      unique: true // 고유한 값
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, { // user model 에 대한 setting
    charset: 'utf8', // 원래 mysql에서는 한글 넣으면 에러난다.
    collate: 'utf8_general_ci', // 한글 저장
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post); // 사람이 포스트를 여러개 가지고 있다.
    // 이거 다음에 Post에 db.Post.belongsTo(db.User);유
    db.User.hasMany(db.Comment);
    // Comment 파일에 적은대로 hasMany보다 belongsTo가 더 중요한 이유는 여기에 만약 id값이 들어오면 여러개의 정보가 들어오는데
    // sql할때 엑셀 구조 짤때 원칙이 한칸에는 하나의 정보만.
    // 다대다는 포스트에
    // 일대일은 hasOne
    db.User.belongsToMany(db.Post, {through: 'Like', as: 'Liked'}); // 좋아요. 중간 테이블 이름을 through로 바꿀수도 있다. 양쪽 다 반드시 명시해줘야한다.
    // Liked에 대한 설명은 포스트에
    // 같은거 할때도 헷갈리니 as를 써준다.
    db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followers', foreignKey: 'FollowingId'});
    db.User.belongsToMany(db.User, {through: 'Follow', as: 'Followings', foreignKey: 'FollowerId'});
    // 같은거 할땐 foreignKey를 적어줘야 한다. 내가 팔로윙 하는 사람을 찾으려면 나를 먼저 찾아야한다. 반대로 생각해서 외래키를 적는다.
    // 같은 테이블이면 똑같이 UserId를 쓰기 때문에 명시해줘야한다.
  };

  return User;
}
