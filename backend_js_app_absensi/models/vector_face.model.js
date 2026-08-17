import {
  DataTypes
} from "sequelize";
import sequelize from "../src/db/sequelize.js";

const VectorFace = sequelize.define(
  "vector_face", {
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
    },

    vector: {
      type: DataTypes.JSON, // ✅ lebih aman dari ARRAY
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
    }
  }, {
    timestamps: true,
    freezeTableName: true,
  }
);

export default VectorFace;