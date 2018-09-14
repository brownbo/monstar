/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('notification', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        operator_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        enabled: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
    }, {
        tableName: 'notification'
    });

    Model.associate = function() {
        Model.belongsTo(app.model.User, { as: 'operator' });
    }

    return Model;
};
