/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('customer', {
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
    username: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    openid: {
          type: DataTypes.STRING(255),
          allowNull: true
      },
    certificate_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    user_type: {
        type: DataTypes.INTEGER(1),
        allowNull: true
    },
    customer_code: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
      merchant_code: {
          type: DataTypes.STRING(255),
          allowNull: true
      },
    certificate_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    phone: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    shop_id: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'customer'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.User, { as: 'operator' });
      Model.belongsTo(app.model.Shop, { as: 'shop' });
   //   Model.belongsTo(app.model.Role, { as: 'role' });
  }

  return Model;
};
