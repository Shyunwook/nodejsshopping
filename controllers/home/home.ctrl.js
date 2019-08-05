const models = require('../../models');

exports.index = async ( req ,res) => {
    const products = await models.Products.findAll({
        include : [
            {
                model : models.User ,
                as : 'Owner',
                attributes : [ 'username' , 'displayname' ]
            },
            { model : models.Tag, as : 'Tag' },
            'LikeUser'
        ],
        where : {
            ...( 
            // 검색어가 있는 경우
            ('name' in req.query && req.query.name) ? 
            {
                // + 태그에서 가져옴 or
                [models.Sequelize.Op.or] : [
                    models.Sequelize.where( models.Sequelize.col('Tag.name') , {
                        [models.Sequelize.Op.like] : `%${req.query.name}%`
                    }),
                    {
                        'name' : {
                            [models.Sequelize.Op.like] : `%${req.query.name}%`
                        }
                    }
                ],
            }
            :
            '' ),
        }
    });

    // 좋아요 내용을 가져온다
    const userLikes = await require('../../helpers/userLikes')(req);

    // console.log(models.Products.findAll())
    res.render( 'home.html' , { products, userLikes });
}