/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('stock', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gift_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gift_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    netspot_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER(15),
      allowNull: true
    },
    operator_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
  }, {
    tableName: 'stock'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.Gift, { as: 'gift' });
      Model.belongsTo(app.model.GiftType, { as: 'gift_type' });
      Model.belongsTo(app.model.User, { as: 'operator' });
      Model.belongsTo(app.model.Netspot, { as: 'netspot' });
  }

  return Model;
};
