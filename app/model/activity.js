/* indent size: 2 */

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('activity', {
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
        pay_type: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        exch_points: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },

        price: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },


        _count: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        cycle_type: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        time_type: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        active_days: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        enabled: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        start_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        end_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
      /*  operator_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },*/

    }, {
        tableName: 'activity'
    });

    Model.associate = function() {
       // Model.belongsTo(app.model.User, { as: 'operator' });
      //  Model.belongsTo(app.model.Area, { as:'parent_area' });
    }

    return Model;
};
