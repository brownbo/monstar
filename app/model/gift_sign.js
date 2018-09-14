module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('gift_sign', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        _count: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        gift_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        netspot_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        memo: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        sign_people_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        examine_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        sign_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        operator_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
    }, {
        tableName: 'gift_sign'
    });

    Model.associate = function() {
        Model.belongsTo(app.model.User, { as: 'operator' });
        Model.belongsTo(app.model.Gift, { as: 'gift' });
        Model.belongsTo(app.model.Netspot, { as:'netspot' });
        Model.belongsTo(app.model.Examine, { as:'examine' });
        Model.belongsTo(app.model.Staff, { as:'sign_people' });
    }

    return Model;
};
