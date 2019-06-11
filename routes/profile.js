const express = require('express');
const router = express.Router();
const models = require('../models');
const passwordHash = require('../helpers/passwordHash');

router.get('/edit', async (req, res) => {
    const user = await models.User.findOne({
        where : {
            id : req.user.id
        },
        attributes: {exclude : ['password']}
    });
    
    res.render('profile/modify.html',{ user : user.dataValues });
})

router.post('/edit', async (req, res) => { 
    await models.User.update(
        {
            displayname : req.body.displayname
        } , 
        { 
            where : { id: req.body.user_id } 
        }
    );

    let result = await models.User.findOne(
        {
            where : {
                id : req.body.user_id
            },
            attributes: {exclude : ['password']}
        },
    )
    console.log(result.dataValues);
    console.log(req.user);
    req.login(result.dataValues,function(err){
        if(!err){
            console.log(req.user);
            res.redirect('/');
        }
    });
})

module.exports = router;