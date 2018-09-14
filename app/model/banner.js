/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('banner', {
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
    img: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    act_time: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    operator_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    type:{
        type: DataTypes.INTEGER(1),
        allowNull: true
    },

      gift_id: {
          type: DataTypes.INTEGER(11),
          allowNull: true
      },
      goods_id: {
          type: DataTypes.INTEGER(11),
          allowNull: true
      },
      voucher_id: {
          type: DataTypes.INTEGER(11),
          allowNull: true
      },
      shop_id: {
          type: DataTypes.INTEGER(11),
          allowNull: true
      },
      business_recommend_id: {
          type: DataTypes.INTEGER(11),
          allowNull: true
      },



  }, {
    tableName: 'banner'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.User, { as: 'operator' });
      Model.belongsTo(app.model.Gift, { as: 'gift' });
      Model.belongsTo(app.model.Goods, { as: 'goods' });
      Model.belongsTo(app.model.Voucher, { as: 'voucher' });
      Model.belongsTo(app.model.Shop, { as: 'shop' });
      Model.belongsTo(app.model.BusinessRecommend, { as: 'business_recommend' });
  }

  return Model;
};
