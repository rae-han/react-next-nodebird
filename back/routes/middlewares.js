exports.isLoggedIn = (req, res, next) => {
  console.log(req.isAuthenticated());
  if(req.isAuthenticated()) { // passport에서 제공하는 것으로 로그인 돼 있으면 true
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.')
  }
}

exports.isNotLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) { // passport에서 제공하는 것으로 로그인 돼 있으면 true
    next();
  } else {
    res.status(401).send('로그인 상태입니다.')
  }
}
