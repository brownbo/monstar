/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('goods', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        desc: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        price: {
            type: DataTypes.INTEGER(15),
            allowNull: true
        },
        sum_count: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        apply_price: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        pay_type: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        is_recommend: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        exch_points: {
            type: DataTypes.INTEGER(15),
            allowNull: true
        },

        option: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        goods_detail: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        commit_person_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        previews: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            defaultValue: '',
        },
        commit_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        /* status: {
         type: DataTypes.INTEGER(1),
         allowNull: true
         },*/
        examine_status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        examine_person_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        examine_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        activity_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        operator_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        enabled: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: 1,
        },
        is_active: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: 1,
        },
    }, {
        tableName: 'goods'
    });

    Model.associate = function () {
        Model.belongsTo(app.model.User, {as: 'operator'});
        //  Model.belongsTo(app.model.Customer, { foreignKey: 'commit_person' });
       // Model.hasMany(app.model.Sales, {foreignKey: 'goods_id', as: 'sales'});
        Model.belongsTo(app.model.Customer, {as: 'commit_person'});
        Model.belongsTo(app.model.Shop, {as: 'shop'});
        Model.belongsTo(app.model.User, {as: 'examine_person'});
        Model.belongsTo(app.model.Activity);
    }

    return Model;
};
