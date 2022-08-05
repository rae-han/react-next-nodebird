const passport = require('passport');
const local = require('./local')
const { User }  = require('../models')

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log(user.id)
    done(null, user.id)
  });
  // req.login의 user가 일로 들어온ㄷ.
  // 이게 뭐냐면 클라이언트 키에 대응하는 서버의 키 ex id: 1 같은 걸 저장한다.

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id }})
      done(null, user)
    } catch(error) {
      console.error(error);
      done(error)
    }
  });
  // id : 1을 통해서 디비에서 가져온다.

  local();
}