const dotenv = require('dotenv');
dotenv.config();
// json을 js로 바꾼 이유는 dotenv를 사용하기 위해서.

module.exports = {
  "development": {
  "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mysql"
},
  "test": {
  "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mysql"
},
  "production": {
  "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mysql"
}
}
