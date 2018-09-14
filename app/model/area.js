/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('area', {
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
    parent_area_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    operator_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },

  }, {
    tableName: 'area'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.User, { as: 'operator' });
      Model.belongsTo(app.model.Area, { as:'parent_area' });
  }

  return Model;
};
