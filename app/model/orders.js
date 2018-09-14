/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('orders', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        eval_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        netspot_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        gift_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        voucher_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        goods_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        verify_type: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        _count: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        create_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        pay_type: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        exch_points: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        sum_price: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        sum_code: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        sum_status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        sum_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        customer_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        pay_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        verify_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        verify_people_type: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        verify_staff_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        verify_merchant_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        order_no: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        customer_name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        total_points:{
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        price:{
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        operator_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        settle_table_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        refund_addr:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        refund_phone:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        refund_desc:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        refund_reason:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        refund_time:{
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        tableName: 'orders'
    });

    Model.associate = function () {
        Model.belongsTo(app.model.SettleTable, {as: 'settle_table'});
        Model.belongsTo(app.model.User, {as: 'operator'});
        Model.belongsTo(app.model.Netspot, {as: 'netspot'});
        Model.belongsTo(app.model.Shop, {as: 'shop'});
        Model.belongsTo(app.model.Goods, {as: 'goods'});
        Model.belongsTo(app.model.Voucher, {as: 'voucher'});
        Model.belongsTo(app.model.Gift, {as: 'gift'});
        Model.belongsTo(app.model.Customer, {as: 'customer'});
        Model.belongsTo(app.model.Staff, {as: 'verify_staff'});
        Model.belongsTo(app.model.Merchant, {as: 'verify_merchant'});
    }

    return Model;
};
