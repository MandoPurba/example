import { DataTypes } from "sequelize";
import sequelize from "../src/db/sequelize.js";

const FrontendBackend = sequelize.define(
  "frontend_backend",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    frontend_route_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "frontend_route",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    backend_route_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "backend_route",
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
        fields: ["frontend_route_id", "backend_route_id"],
      },
    ],
  }
);

export default FrontendBackend;