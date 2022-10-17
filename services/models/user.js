const users = (db, DataTypes, options) => {
  const { paranoid, ...other } = options;
  const model = db.define(
    "users",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING },
      username: { type: DataTypes.STRING, unique: true },
      cover: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING, unique: true },
      bio: { type: DataTypes.STRING },
      back_cover: { type: DataTypes.STRING },
      role: { type: DataTypes.STRING, defaultValue: "USER" },
    },
    { ...other, paranoid: false, timestamps: false }
  );
  model.associate = function (models) {};

  return model;
};

module.exports = users;
