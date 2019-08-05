const models = require('../../models');

exports.get_join = ( _ , res) => {
    res.render('accounts/join.html');
};

exports.post_join = async(req, res) => {
    try{
        let user = await models.User.findOne({
            where : {
                username : req.body.username
            }
        });

        if(user!=null){
            res.send(`<script>alert('중복된 아이디입니다');\
            history.go(-1);</script>`);
        }else{
            await models.User.create(req.body);
            res.send('<script>alert("회원가입 성공");\
            location.href="/accounts/login";</script>');
        }

    }catch(e){

    }
};

exports.get_login = ( req, res) => {
    res.render('accounts/login.html', {
        flashMessage : req.flash().error
    });
};

exports.post_login = async (req, res) => {
    // let list = await models.Cart.findAll({
    //     where : {user_id : req.user.id},
    //     include : [{
    //         model : models.Products,
    //         as : 'Item',
    //         attributes : ['name', 'price', 'thumbnail']
    //     }]
    // });

    // let cartList = {};

    // for(let i = 0; i < list.length; i ++ ){
    //     let item = list[i].dataValues;
    //     cartList[item.id] = {
    //         number : item.number,
    //         amount : item.amount,
    //         thumbnail : item.Item.dataValues.thumbnail,
    //         name : item.Item.dataValues.name,
    //     }
    // }
    // console.log(cartList);
    // console.log(req.cookies.cartList);
    // console.log(Object.assign(cartList,JSON.parse(unescape(req.cookies.cartList))));

    res.send(`<script>alert("로그인 성공");\
    location.href="/";</script>`);
};

exports.get_logout = async (req, res) => {

    // let cartList = {}; //장바구니 리스트

    // //쿠키가 있는지 확인해서 뷰로 넘겨준다
    // if( typeof(req.cookies.cartList) !== 'undefined'){
    //     //장바구니데이터
    //     cartList = JSON.parse(unescape(req.cookies.cartList));
    // }
    
    // let bulk = [];
    // for(let key in cartList){
    //     let param = {
    //         product_id : key,
    //         user_id : req.user.id,
    //         number : cartList[key].number,
    //         amount : cartList[key].amount
    //     }
    //     bulk.push(param);
    // }
    // await models.Cart.bulkCreate(bulk);
    // res.send(bulk);
    
    req.logout();
    res.redirect('/accounts/login');
};