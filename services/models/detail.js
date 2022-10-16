const user_details = (db, DataTypes, options) => {
    const { paranoid, ...other } = options;
    const model = db.define(
      "user_details",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        bio: { type: DataTypes.STRING },
      },
      { ...other, paranoid: false, timestamps: true }
    );
    model.associate = function (models) {
      model.belongsTo(models.users,
        {foreignKey: {name: 'UserDetailId',
            type: DataTypes.UUID,
            allowNull: false,
          },});
    };
    return model;
  };
  
  module.exports = user_details;