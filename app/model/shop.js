/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('shop', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        open_id: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        sign_status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        sign_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        shop_type_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        shop_img: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            defaultValue: '',
        },
        shop_desc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        connect_person: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        connect_phone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        address: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        recommend_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        recommend1_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        recommend2_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        account_name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        merId: {
            type: DataTypes.CHAR(32),
            allowNull: true
        },
        parent_merId: {
            type: DataTypes.CHAR(32),
            allowNull: true,
            get(){
                return app.config.shopCode;
            }
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        is_recommend: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        operator_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        is_thefamily: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        business_img: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        examine_option: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        examine_status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        examine_person_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        long: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        distance: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        examine_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_settlement: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        /*  merchant_id: {
         type: DataTypes.INTEGER(11),
         allowNull: true
         },*/
        geo_code: {
            type: DataTypes.STRING(225),
            allowNull: true
        },
        settlement_cycle: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        apply_person_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        }
    }, {
        tableName: 'shop'
    });

    Model.associate = function () {
        Model.belongsTo(app.model.ShopType, {as: 'shop_type'});
        //  Model.belongsTo(app.model.Merchant, {as: 'merchant'});
        Model.belongsTo(app.model.BusinessRecommend, {as: 'recommend'});
        Model.belongsTo(app.model.Goods, {as: 'recommend1'});
        Model.belongsTo(app.model.Voucher, {as: 'recommend2'});
        Model.belongsTo(app.model.User, {as: 'examine_person'});
        Model.belongsTo(app.model.User, {as: 'operator'});
        Model.belongsTo(app.model.User, {as: 'apply_person'});
        Model.hasMany(app.model.Voucher, {as: 'vouchers'});
        Model.hasOne(app.model.Goods, {foreignKey: 'shop_id', as: 'goods'});
        Model.hasOne(app.model.Voucher, {foreignKey: 'shop_id', as: 'voucher'});
    }

    return Model;
};
