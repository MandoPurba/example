import { DataTypes } from "sequelize";
import sequelize from "../src/db/sequelize.js";

const WorkSchedule = sequelize.define(
  "work_schedule",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    branch_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "branch",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    day: {
      type: DataTypes.ENUM(
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ),
      allowNull: false,
    },

    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

export default WorkSchedule;