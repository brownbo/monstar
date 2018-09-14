/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('user', {
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
    role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },

  }, {
    tableName: 'user'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.Role, { as: 'role' });
    //  Model.belongsTo(app.model.User, { as: 'operator' });
  }

  return Model;
};
