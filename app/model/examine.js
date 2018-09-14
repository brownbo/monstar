/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('examine', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        gift_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        _count: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        sub_netspot_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        applicant_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        application_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        is_allocation: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        option: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        operator_id: {
            type: DataTypes.INTEGER(11),
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
        pass_count: {
            type: DataTypes.INTEGER(15),
            allowNull: true
        },
        netspot_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },

    }, {
        tableName: 'examine'
    });

    Model.associate = function () {
        Model.belongsTo(app.model.Gift, {as: 'gift'});
        Model.belongsTo(app.model.Netspot, {as: 'sub_netspot'});
        Model.belongsTo(app.model.User, {as: 'operator'});
        Model.belongsTo(app.model.Staff, {as: 'applicant'});

        Model.belongsTo(app.model.User, {as: 'examine_person'});
        Model.belongsTo(app.model.Netspot, {as: 'netspot'});
    }

    return Model;
};
