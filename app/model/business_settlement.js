/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('business_settlement', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        shop_name:{
            type: DataTypes.STRING(50),
            allowNull: true
        } ,
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        settle_start: {
            type: DataTypes.DATE,
            allowNull: true
        },
        settle_end: {
            type: DataTypes.DATE,
            allowNull: true
        },
        settlement_count:{
            type: DataTypes.STRING(50),
            allowNull: true
        } ,
        settlement_amount: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        file: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        is_upload_result: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        operator_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
    }, {
        tableName: 'business_settlement'
    });

    Model.associate = function() {
        Model.belongsTo(app.model.User, { as: 'operator' });
        Model.belongsTo(app.model.Shop, { as: 'shop' });
    }

    return Model;
};
