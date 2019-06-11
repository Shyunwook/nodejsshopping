const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//flash  메시지 관련
const flash = require('connect-flash');
 
//passport 로그인 관련
const passport = require('passport');
const session = require('express-session');

// db 관련
const db = require('./models');


class App {

    constructor () {
        this.app = express();
        
        // db 접속
        this.dbConnection();

        // 뷰엔진 셋팅
        this.setViewEngine();

        // 세션 셋팅
        this.setSession();

        // 미들웨어 셋팅
        this.setMiddleWare();

        // 정적 디렉토리 추가
        this.setStatic();

        // 로컬 변수
        this.setLocals();

        // 라우팅
        this.getRouting();


    }

    dbConnection(){
        // DB authentication
        db.sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
            //  return db.sequelize.sync();
            // return db.sequelize.drop();
        })
        .then(() => {
            console.log('DB Sync complete.');
            // 더미 데이터가 필요하면 아래 설정
            //  require('./config/insertDummyData')();
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }


    setMiddleWare (){
        
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());

        //passport 적용
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        //플래시 메시지 관련
        this.app.use(flash());
 

    }

    setViewEngine (){

        nunjucks.configure('template', {
            autoescape: true,
            express: this.app
        });

    }


    setSession (){

        const SequelizeStore = require('connect-session-sequelize')(session.Store);
        
        const sessionMiddleWare = session({
            secret: 'fastcampus',
            resave: false,
            saveUninitialized: true,
            cookie: {
            maxAge: 2000 * 60 * 60 //지속시간 2시간
            },
            store: new SequelizeStore({
                db: db.sequelize,
            }),
        });
        this.app.use(sessionMiddleWare);

    }


    setStatic (){
        this.app.use('/uploads', express.static('uploads'));
    }

    setLocals(){
        this.app.use( (req, _, next) => {

            this.app.locals.isLogin = req.isAuthenticated();

            this.app.locals.req_path = req.path;


            next();
        });
    }

    getRouting (){
        this.app.use(require('./controllers'))
        // controllers 뒤에 경로가 생략되면 자동으로 index.js
    }

}

module.exports = new App().app;