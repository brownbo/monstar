/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('netspot', {
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
    area_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    long: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    lat: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    is_parent: {
        type: DataTypes.INTEGER(1),
        allowNull: true
    },
    operator_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    merId: {
        type: DataTypes.CHAR(32),
        allowNull: true
    },
    parent_merId: {
        type: DataTypes.CHAR(32),
        allowNull: true
    },
   /* staff_id:{
        type: DataTypes.INTEGER(11),
        allowNull: true
    },*/
  }, {
    tableName: 'netspot'
  });

  Model.associate = function() {
      Model.belongsTo(app.model.Area, { as: 'area' });
    //  Model.belongsTo(app.model.Staff, { as: 'staff' });
      Model.belongsTo(app.model.User, { as: 'operator' });
  }

  return Model;
};
