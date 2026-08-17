import { DataTypes } from "sequelize";
import sequelize from "../src/db/sequelize.js";

const SubItemFrontendBackend = sequelize.define(
  "subitem_frontend_backend",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    subitem_frontend_route_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "subitem_frontend_route",
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
        fields: ["subitem_frontend_route_id", "backend_route_id"],
      },
    ],
  }
);

export default SubItemFrontendBackend;