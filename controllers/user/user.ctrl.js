const models = require('../../models');

exports.get_index = async (req, res) => {
    const user = await models.User.findOne({
        where  :{ id : req.params.id },
        include : [ 
            {
                model: models.Products,
                as : 'Likes',
                include : [
                    { model : models.Tag, as : 'Tag' },
                    'LikeUser'
                ]
            }
        ]
    });

    res.render('user/list.html', { user });
}
