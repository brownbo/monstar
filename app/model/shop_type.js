/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('shop_type', {
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
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
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
    tableName: 'shop_type'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.User, { as: 'operator' });
  }

  return Model;
};
