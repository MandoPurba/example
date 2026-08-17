import {
  DataTypes
} from "sequelize";
import sequelize from "../src/db/sequelize.js";

const AccessRouteDepartment = sequelize.define(
  "access_route_department", {
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

    department_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "department",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  }, {
    timestamps: true,
    freezeTableName: true,

    indexes: [{
      unique: true,
      fields: ["frontend_route_id", "subitem_frontend_route_id", "department_id"],
    }, ],
  }
);

export default AccessRouteDepartment;