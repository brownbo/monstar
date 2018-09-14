/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('evaluate_goods', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    goods_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    eval_customer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    eval_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    eval_content: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reply_user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    reply_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reply_content: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_first_eval: {
        type: DataTypes.INTEGER(1),
        allowNull: true
    },
    parent_eval_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    stars: {
        type: DataTypes.INTEGER(15),
        allowNull: true
    },
    operator_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
  }, {
    tableName: 'evaluate_goods'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.User, { as: 'operator' });
      Model.belongsTo(app.model.Goods, { as: 'goods' });
      Model.belongsTo(app.model.Customer, { as: 'eval_customer' });
      Model.belongsTo(app.model.User, { as: 'reply_user' });
      Model.belongsTo(app.model.EvaluateGoods, { as: 'parent_eval' });
  }

  return Model;
};
