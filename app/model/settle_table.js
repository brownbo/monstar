/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('settle_table', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        shop_name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        total_points: {
            type: DataTypes.INTEGER(15),
            allowNull: true
        },
        discount: {
            type: DataTypes.FLOAT(15),
            allowNull: true
        },
        real_points: {
            type: DataTypes.FLOAT(15),
            allowNull: true
        },
        amount: {
            type: DataTypes.FLOAT(15),
            allowNull: true
        },
        goods_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        _count: {
            type: DataTypes.INTEGER(15),
            allowNull: true
        },

    }, {
        tableName: 'settle_table'
    });

    Model.associate = function() {
        Model.belongsTo(app.model.Shop, { as:'shop' });
        Model.hasMany(app.model.Orders, {as: 'orders'});
    }

    return Model;
};
