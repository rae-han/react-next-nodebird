const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');

const app = express();

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');

const db = require('./models');
const passportConfig = require('./passport')

db.sequelize.sync()
    .then(() => {
      console.log('db 연결 성공')
    })
    .catch(console.error)
passportConfig();
dotenv.config();

if(process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(hpp())
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}

// use는 express서버에 뭔가를 장착한다는 뜻.
app.use(express.json()); // 이건 프론트에서 json형식으로 데이터를 보냈을때 req.body에 넣겠다.
// 즉 axios로 보내면 여기로 온다.
app.use(express.urlencoded({ extended: true })); // 폼서브밋으로 데이터를 보내면 urlencoded로 오는데 이걸 처리해서 req.body안에 넣어준다.
// 일반 form 으로 보내면 여기로 온다.
app.use(cors({
  // origin: '*',
  // origin: true, // 위는 모든 주소, 이건 보낸 곳의 주소가 자동으로 들어간다.
  origin: ['http://localhost:3060', 'http://localhost', 'http://localhost:80', 'nodebird.com', process.env.FRONT_ADDRESS], // 위는 모든 주소, 이건 보낸 곳의 주소가 자동으로 들어간다.
  credentials: true,
  secret: process.env.COOKIE_SECRET, // 서버에서 특정 정보에 해당하는 id를 암호화된 문자열로 바꿔서 클라이언트에 보내준다고 했는데 그때 암호화할 때 사용된다. 그래서 잘 숨겨야한다.
}))
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize())
app.use(passport.session());
// static
app.use('/', express.static(path.join(__dirname, 'uploads')));
// path.join 을 쓰는 이유가 윈도우와 맥 리눅스의 경로 구분자가 다르기 때문에.
// 뒤에 경로를 /로 제공해주겠다.
// 이렇게하면 프론트 쪽에서 서버쪽 폴더 구조가 가려져서 보안에 유리한 이점이 있다.

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.use('/user', userRouter);
// app.use(postRouter); // post를 프리픽스 해주고 싶다면
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/hashtag', hashtagRouter);

// 에러처리 미들웨어가 이 부분에 내부적으로 존재하고 있다. 하지만 아래와 같이 정의할 수 있다.
// app.use((err, req, res, next) => {
//   console.error(err)
// })

app.listen(80, () => {
  console.log('running server');
})
