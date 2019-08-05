const models = require('../models');

module.exports = async (req) => {
    const userLikes = [];
    if(req.isAuthenticated()){
        const user = await models.User.findOne({
            where : { id : req.user.id},
            include : [ 'Likes' ],
            attributes: ['id']
        });
    
        for(let key in user.dataValues.Likes){
            userLikes.push(user.dataValues.Likes[key].id)
        }
    }
    return userLikes;
}