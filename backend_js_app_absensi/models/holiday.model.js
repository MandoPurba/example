import { DataTypes } from "sequelize";
import sequelize from "../src/db/sequelize.js";

const Holiday = sequelize.define(
  "holiday",
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
      onUpdate: "CASCADE",
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    isNational: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // optional upgrade biar lebih fleksibel
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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

export default Holiday;