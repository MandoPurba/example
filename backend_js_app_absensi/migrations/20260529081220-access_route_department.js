'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('access_route_department', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      frontend_route_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'frontend_route',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      subitem_frontend_route_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'subitem_frontend_route',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      department_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'department',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addConstraint('access_route_department', {
      fields: ['frontend_route_id', 'subitem_frontend_route_id', 'department_id'],
      type: 'unique',
      name: 'unique_access_route_department',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('access_route_department');
  },
};