module.exports = function(sequelize, DataTypes){
    const ContactsMemo = sequelize.define('ContactsMemo',
        {
            id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
            content : {
                type: DataTypes.TEXT,
                validate : {
                    len : [0, 500]
                }
            }
        },{
            tableName: 'ContactsMemo'
        }
    );

    return ContactsMemo;
}