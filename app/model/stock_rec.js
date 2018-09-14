/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('stock_rec', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    examine_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    gift_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    active_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    status: {
        type: DataTypes.INTEGER(1),
        allowNull: true
    },
    allocation_in_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    allocation_out_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    allocation_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    create_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    operator_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sign_count:{
        type: DataTypes.INTEGER(15),
        allowNull: true
    },
    sign_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
  }, {
    tableName: 'stock_rec'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.Examine, { as: 'examine' });
      Model.belongsTo(app.model.Gift, { as: 'gift' });
      Model.belongsTo(app.model.Netspot, { as: 'allocation_in' });
      Model.belongsTo(app.model.Netspot, { as: 'allocation_out' });
      Model.belongsTo(app.model.User, { as: 'operator' });

  }

  return Model;
};
