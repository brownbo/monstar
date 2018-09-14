/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gift', {
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
    gift_type_id: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    brand: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    imgs: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    desc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_hot: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    pay_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    exch_points: {
      type: DataTypes.INTEGER(15),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER(15),
      allowNull: true
    },
    paid_users: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    business_recommend: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    activity_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    operator_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    enabled: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: 1,
    },
    is_active: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: 1,
    },
  }, {
    tableName: 'gift'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.GiftType, { as: 'gift_type' });
      Model.belongsTo(app.model.Activity, { as: 'activity' });
      Model.belongsTo(app.model.User, { as: 'operator' });
  }

  return Model;
};
