/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('business_recommend', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    img:{
        type: DataTypes.STRING(50),
        allowNull: true
    } ,
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    operator_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_hot: {
        type: DataTypes.INTEGER(1),
        allowNull: true
    },
  }, {
    tableName: 'business_recommend'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.User, { as: 'operator' });
  }

  return Model;
};
