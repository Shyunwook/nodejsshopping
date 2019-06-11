const moment = require('moment');

module.exports = function(sequelize, DataTypes){
    let Contacts = sequelize.define('Contacts',
        {
            id : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            title : { type: DataTypes.STRING },
            thumbnail : { type: DataTypes.STRING },
            content : { type: DataTypes.TEXT },
        }
    );

    Contacts.associate = (models) => {
        Contacts.hasMany(models.ContactsMemo, {as: "Memo", foreignKey: 'contact_id', sourctKey: 'id', onDelete: 'CASCADE'});
    }

    Contacts.prototype.dateFormat = (date) => {
        return moment(date).format('YYYY-MM-DD');
    }

    return Contacts;
}