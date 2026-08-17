import {
    DataTypes
} from 'sequelize';
import sequelize from '../src/db/sequelize.js';

const SubItemFrontendRoute = sequelize.define('subitem_frontend_route', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    child_of_frontend_route_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "frontend_route",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },

    name: {
        type: DataTypes.STRING,
        unique: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    timestamps: true,
    freezeTableName: true,
});

export default SubItemFrontendRoute;