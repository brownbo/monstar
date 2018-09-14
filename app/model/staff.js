/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('staff', {
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
        name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        img: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: true
        },
        netspot_id: {
            type: DataTypes.INTEGER(11),
            unique: true,
            allowNull: true
        },
        operator_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
    }, {
        tableName: 'staff'
    });

    Model.associate = function () {
        Model.belongsTo(app.model.Netspot, {as: 'netspot'});
        Model.belongsTo(app.model.User, {as: 'operator'});
    }

    return Model;
};
