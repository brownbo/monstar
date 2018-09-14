/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('merchant', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        shop_code: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        shop_id:{
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        img: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        operator_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
    }, {
        tableName: 'merchant'
    });

    Model.associate = function() {
        Model.belongsTo(app.model.User, { as: 'operator' });
        Model.belongsTo(app.model.Shop, {as: 'shop'});
   //     Model.hasOne(app.model.Shop, {foreignKey: 'merchant_id', as: 'shop'});
        // Model.belongsTo(app.model.Role, { as: 'role' });
    }

    return Model;
};
