const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require("bcrypt");
const { User } = require('../models')

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    // 프론트에서 서버로 올때 req.body.email,password로 온다는걸 적어준 것
    // id가 email이라 usernameField를 email로 했다.
  }, async (email, password, done) => {
    console.log(email, password, done);
    try { // 비동기 할땐 항상 에러가 날 수 있다.
      const user = await User.findOne({
        where: { email }
      });

      if(!user) {
        return done(null, false, { reason: '존재하지 않는 사용자입니다!' }); // 순서대로 서버에러, 성공, 클라이언트 에러.
      }

      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);
      }

      return done(null, false, { reason: '비밀번호가 틀렸습니다.' })
    } catch (error) {
      console.error(error);
      return done(error);
    }

  }));
}