const { Router } = require('express');
const router = Router();
const ctrl = require('./accounts.ctrl');
const models = require('../../models');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('../../helpers/passwordHash');

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // let result = user;
    // result.password = "";
    // console.log('deserializeUser');
    // done(null, result);
    // 위와 같은 방식으로도 세션에 사용자 정보가 입력될 때 비밀번호를 삭제할 수 있다.
    // 페이지가 넘어갈 때 마다 최종적으로 deserialize 에서 사용자 정보를 세션에 입력한다.
    done(null, user);
})

passport.use(new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
},
    async(req, username, password, done) => {
        const user = await models.User.findOne({
            where : {
                username,
                password : passwordHash(password)
            },
            attributes: {exclude : ['password']}
        });

        if(!user){
            return done(null, false, {message : "일치하는 아이디 패스워드가 존재하지 않습니다"});

        // 유저에서 조회되면 세션 등록쪽으로 데이터를 넘김    
        }else{
            console.log(req.user);
            return done(null, user.dataValues);
            // req.user에 DB에서 조회해 온 값을 넣어준다
        }
    }
));

router.get('/join', ctrl.get_join);
router.post('/join', ctrl.post_join);
router.get('/login', ctrl.get_login);

router.post('/login', 
    passport.authenticate('local', {
        failureRedirect : '/accounts/login',
        failureFlash : true
    }),ctrl.post_login);

router.get('/logout', ctrl.get_logout);    

module.exports = router;