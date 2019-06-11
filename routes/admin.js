const express = require('express');
const router = express.Router();
const models = require('../models');
const loginRequired = require('../helpers/loginRequired');
const paginate = require('express-paginate');

const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});

//이미지 저장되는 위치 설정
const path = require('path');
const uploadDir = path.join( __dirname , '../uploads/product' ); // 루트의 uploads위치에 저장한다.
const fs = require('fs'); // 파일을 삭제할 때 사용되는 놈

//multer 세팅
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req, file, callback) => { //이미지가 저장되는 도착지 지정
        callback(null, uploadDir);
    },
    filename : (req, file, callback) => { // products-날짜.jpg(png) 형태로 저장
        callback(null, 'products-' + Date.now() + '.' +
            file.mimetype.split('/')[1]
        );
    }
});
const upload = multer({storage : storage});

function testMiddleWare(req, res, next){
    console.log('미들웨어 작동');
    next();
}

router.get('/', (req, res) => {
    res.send('admin app');
});

router.get('/products', paginate.middleware(2, 50), async(req, res) => {
    // middleware('한페이지에 표시할 갯수', '최대 리밋 제한')
    try{
        const [ products, totalCount ] = await Promise.all([

            models.Products.findAll({
                include : [
                    {
                        model : models.User ,
                        as : 'Owner',
                        attributes : [ 'username' , 'displayname' ]
                    },
                ],
                order : [
                    ['createdAt', 'desc']
                ],
                limit : req.query.limit , // middleware 의 첫번째 파라미터로 넘어온 값
                offset : req.offset // 시작 지점
            }),

            models.Products.count()
        ]);

        const pageCount = Math.ceil( totalCount / req.query.limit );
    
        const pages = paginate.getArrayPages(req)( 4 , pageCount, req.query.page);

        res.render( 'admin/products.html' , { products , pages , pageCount });
    }catch(e){

    }
})

router.get('/products/write', loginRequired, csrfProtection, (req, res) => {
    // csrfToken 함수를 사용하기 위해 get에서 미들웨어 사용
    res.render('admin/form.html', {csrfToken : req.csrfToken()});
})

router.post('/products/write', loginRequired, upload.single('thumbnail'), csrfProtection, async(req, res) => {
    //thumbnail -> form 이미지 input 의 name / single -> 파일을 하나만 받을 경우 (여러개인 경우 'arry') 
    // request에서 _csrf 이름으로 넘어온 토큰값이 아까 발행한 토큰이 맞는지 확인하여 맞을 경우 제어권 전달
    try{
        // 만약 image upload input이 여러개라면... req.file[0], req.file[1] 과 같이 값을 받아볼 수 있다
        req.body.thumbnail = (req.file) ? req.file.filename : "";

        // await models.Products.create(req.body);
        
        // 유저를 가져온다음에 저장
        const user = await models.User.findByPk(req.user.id);
        await user.createProduct(req.body)
        res.redirect('/admin/products');
    }catch(e){
        
    }
})

router.post('/products/ajax_summernote', loginRequired, upload.single('thumbnail'), (req, res) => {
    res.send('/uploads/product/' + req.file.filename);
});

router.get('/products/detail/:id' , async(req, res) => {
    try{
        const product = await models.Products.findOne({
            where : {
                id : req.params.id
            },
            include : [
                'Memo'
            ]
        });
        res.render('admin/detail.html', { product });  

    }catch(e){

    }    
});

router.post('/products/detail/:id', async(req, res) => {
    try{
        const product = await models.Products.findByPk(req.params.id);
        //create + as 에 적은 내용 (Products.js association 에서 적은 내용)

        await product.createMemo(req.body);
        res.redirect('/admin/products/detail/' + req.params.id);
    }catch(e){

    }
})

router.get('/products/edit/:id',loginRequired, csrfProtection, async(req, res) => {
    try{
        const product = await models.Products.findByPk(req.params.id);
        res.render('admin/form.html', { 
            product,
            csrfToken : req.csrfToken() 
        });  

    }catch(e){

    }
});

router.post('/products/edit/:id',loginRequired, upload.single('thumbnail'), csrfProtection, async(req, res) => {
    try{

        //이전에 저장되어 있는 파일명을 받아오기 위함
        const product = await models.Products.findByPk(req.params.id);

        //파일 요청이 있으면 이전 업로드된 파일을 삭제한다
        if(req.file && product.thumbnail){
            fs.unlinkSync(`${uploadDir}/${product.thumbnail}`);
            //파일 삭제를 동기화로 처리하려는 의도 -> 근데 우리가 굳이 파일 삭제를 기다려야하나? 그냥 다음꺼 진행해도 어차피 파일은
            //삭제될텐데... -> 이것도 맞는말
        }

        //파일 요청이 있으면 파일명을 담고 아니면 이전 DB에서 가져온다
        req.body.thumbnail = (req.file) ? req.file.filename : product.thumbnail;

        await models.Products.update(
            req.body , 
            { 
                where : { id: req.params.id } 
            }
        );
        res.redirect('/admin/products/detail/' + req.params.id );
    }catch(e){

    }
});

router.get('/products/delete/:id', async(req, res) => {
    try{
        await models.Products.destroy({
            where: {
                id: req.params.id
            }
        });
        res.redirect('/admin/products');
    }catch(e){

    }
});

router.get('/products/delete/:product_id/:memo_id', async(req, res) => {
    try{

        await models.ProductsMemo.destroy({
            where: {
                id: req.params.memo_id
            }
        });
        res.redirect('/admin/products/detail/' + req.params.product_id );

    }catch(e){

    }
});
// 위 방식도 Products의 as memo 로 인클루드해서 불러와서 해당 댓글을 삭제하는 방식으로 시도해보자!



// router.get('/products', ( _ , res) => { // request를 사용하지 않을 경우 '_' 처리하여 사용하지 않음을 명시할 수 있다
//     // res.send('admin products');
//     models.Products.findAll({

//     }).then((products) => {
//         // DB에서 받은 products를 products변수명으로 내보냄
//         res.render('admin/products.html', {products : products});
//         // res.render('admin/products.html', {products}); -> 이렇게 축약해서 사용할 수도 있음
//     })
// })


// router.post('/products/write', (req, res) => {
//     models.Products.create({
//         name : req.body.name,
//         price : req.body.price,
//         description : req.body.description
//     }).then(() => {
//         res.redirect('/admin/products');
//     })
//     // models.Products.create(req.body).then(() => {
//     //     res.redirect('/admin/products');
//     // })
// })

// router.get('/products/detail/:id', (req, res) => {
//     models.Products.findByPk(req.params.id).then((product) => {
//         res.render('admin/detail.html', {product});
//     })
// })

// router.get('/products/edit/:id', (req, res) => {
//     models.Products.findByPk(req.params.id).then((product) => {
//         res.render('admin/form.html', {product});
//     })
// })

// router.post('/products/edit/:id', (req, res) => {
//     models.Products.update(
//         {
//             name : req.body.name,
//             price : req.body.price,
//             description : req.body.description
//         },
//         {
//             where : {id : req.params.id}
//         }
//     ).then(() => {
//         res.redirect('/admin/products/detail/' + req.params.id);
//     })
// })

// router.get('/products/delete/:id', (req, res) => {
//     models.Products.destroy(
//         {
//             where : {
//                 id : req.params.id
//             }
//         }
//     ).then(() => {
//         res.redirect('/admin/products');
//     })
// })

module.exports = router;