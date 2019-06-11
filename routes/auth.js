const express = require('express');
const router = express.Router();

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoTalkStrategy = require('passport-kakao').Strategy;

const models = require('../models');

const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG

const loginThirdparty = require('../helpers/loginByThirdparty');

passport.serializeUser( (user, done) => {
    done(null, user);
});

passport.deserializeUser( (user, done) => {
    done(null, user);
});

passport.use(new FacebookStrategy({
        // https://developers.facebook.com에서 appId 및 scretID 발급
        clientID: process.env.FACEBOOK_APPID , //입력하세요
        clientSecret: process.env.FACEBOOK_SECRETCODE , //입력하세요.
        callbackURL: `${process.env.SITE_DOMAIN}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
    },
    async (accessToken, refreshToken, profile, done) => {
        loginThirdparty({
            id : profile.id,
            auth_type : 'facebook',
            displayName : profile.displayName,
        },done);
    }
));

passport.use(new KakaoTalkStrategy({
        clientID : process.env.KAKAO_CLIENTID,
        callbackURL : process.env.KAKAO_CALLBACKURL
    },function(accessToken, refreshToken, profile, done){
        loginThirdparty({
            id : profile.id,
            auth_type : 'kakaotalk',
            displayName : profile.displayName,
        },done);
    }
));

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
    passport.authenticate('facebook', 
        { 
            successRedirect: '/',
            failureRedirect: '/auth/facebook/fail' 
        }
    )
);

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', 
    passport.authenticate('kakao',
        {
            successRedirect: '/',
            failureRedirect: '/auth/kakao/fail'
        }
    )
)

// router.get('/kakao/callback', (req, res) => {
//     res.redirect('/');
// })

//로그인 성공시 이동할 주소
router.get('/facebook/success', (req,res) => {
    res.send(req.user);
});

router.get('/facebook/fail', (req,res) => {
    res.send('facebook login fail');
});


module.exports = router;