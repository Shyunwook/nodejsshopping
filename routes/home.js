const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET home page. */
router.get('/', async ( req ,res) => {
    const products = await models.Products.findAll({
        include : [
            {
                model : models.User,
                as : 'Owner', // home.html 에서 user 모델의 정보를 owner로 접근하겠다는 의미
                attributes : ['username', 'displayname']
            }
        ]
    });
    console.log(req.user);
    res.render( 'home.html' , { products });
});

module.exports = router;