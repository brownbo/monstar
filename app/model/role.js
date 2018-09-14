/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('role', {
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
    power: {
      type: DataTypes.STRING(10000),
      allowNull: true
    },
    enabled: {
        type: DataTypes.INTEGER(1),
        allowNull: true
    },
      operator_id: {
          type: DataTypes.INTEGER(11),
          allowNull: true
      },
  }, {
    tableName: 'role'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.User, { as: 'operator' });
  }

  return Model;
};
