module.exports = function(sequelize, DataTypes){
    const Cart = sequelize.define('Cart',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            number : { type: DataTypes.INTEGER },
            amount : { type: DataTypes.INTEGER }
        }
    );

    Cart.associate = (models) => {
        Cart.belongsTo(models.Products, 
            { as :'Item',  foreignKey: 'product_id', targetKey: 'id'} );
    };
    
    return Cart;
}