const models = require('../models');

module.exports = async (profile, done) => {
    try{
        const username = profile.id;
        const auth_type = profile.auth_type;

        const exist = await models.User.count({
            where : {
                username,
                auth_type
            }
        })

        let user;

        if(!exist){
            user = await models.User.create({
                username,
                auth_type,
                displayname: profile.displayName,
                password : auth_type
            })
        }else{
            user = await models.User.findOne({
                where : {
                    username,
                    auth_type
                },
                attributes: {exclude : ['password']}
            })
        }
        done(null, user);
    }catch(e){

    }
}