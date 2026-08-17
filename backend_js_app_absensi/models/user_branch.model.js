import { DataTypes } from "sequelize";
import sequelize from "../src/db/sequelize.js";

const UserBranch = sequelize.define(
  "user_branch",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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

    branch_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "branch",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
    freezeTableName: true,

    indexes: [
      {
        unique: true,
        fields: ["user_id", "branch_id"],
      },
    ],
  }
);

export default UserBranch;