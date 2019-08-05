const moment = require('moment');

module.exports = function(sequelize, DataTypes){
    var Products = sequelize.define('Products', // 테이블이 생성되면 테이블이름에 자동으로 's'가 붙는다
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name : { type: DataTypes.STRING },
            thumbnail : { type: DataTypes.STRING },
            price : { type: DataTypes.INTEGER },
            description : { type: DataTypes.TEXT }
        }
        // {
        //     tableName : 'Product'
        // }
        // 자동으로 복수형 변환되서 만들어지는 테이블 명을 바꾸려면 위의 소스를 추가하면 된다.
    );

    // 제품 모델 관계도
    Products.associate = (models) => {
        // 메모 모델에 외부키를 건다
        // onDelete 옵션의 경우 제품 하나가 삭제되면 외부키가 걸린 메모들도 싹다 삭제해준다
        Products.hasMany(models.ProductsMemo, 
            {as: 'Memo', foreignKey: 'product_id', sourceKey: 'id' , onDelete: 'CASCADE'});

        Products.belongsTo(models.User, 
            { as :'Owner',  foreignKey: 'user_id', targetKey: 'id'} );

        // 즐겨찾기 구현
        Products.belongsToMany(models.User, {
            through: {
                model: 'LikesProducts',
                unique: false
            },
            as: 'LikeUser',
            foreignKey: 'product_id',
            sourceKey: 'id',
            constraints: false
        })

        Products.belongsToMany( models.Tag ,{
            through: {
                model: 'TagProduct',
                unique: false
            },
            as : 'Tag', 
            foreignKey: 'product_id',
            sourceKey: 'id',
            constraints: false
        });

        // Products.hasMany(models.Cart,
        //     {as: 'Cart', foreignKey: 'product_id', sourceKey: 'id' , onDelete: 'CASCADE'})
    };
    
    Products.prototype.dateFormat = (date) => {
        return moment(date).format('YYYY-MM-DD');
    } // --- 1

    // Products.prototype.dateFormat = (date) => (
    //     moment(date).format('YYYY-MM-DD')
    // ); --- 2

    // 1과 2는 같은 의미! -> {}를 () 바꿔주고 return 을 생략할 수 있다

    return Products;
}