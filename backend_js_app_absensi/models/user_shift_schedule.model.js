import { DataTypes } from "sequelize";
import sequelize from "../src/db/sequelize.js";

const UserShiftSchedule = sequelize.define(
  "user_shift_schedule",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    // 🔥 WAJIB untuk sistem 1 bulan schedule
    workDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("schedule", "off", "leave"),
      allowNull: false,
      defaultValue: "schedule",
    },
  },
  {
    timestamps: true,
    freezeTableName: true,

    // 🔥 anti duplicate data
    indexes: [
      {
        unique: true,
        fields: ["user_id", "workDate"],
      },
    ],
  }
);

export default UserShiftSchedule;