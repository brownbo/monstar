/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gift_type', {
    id: {
      type: DataTypes.INTEGER(3).UNSIGNED.ZEROFILL,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    count_warning: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    enabled: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 1,
    },
    img: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    operator_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
  }, {
    tableName: 'gift_type'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.User, { as: 'operator' });
  }

  return Model;
};
