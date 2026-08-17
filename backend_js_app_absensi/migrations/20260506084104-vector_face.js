'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vector_face', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },

        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        unique: true
      },

      vector: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      confidence: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vector_face');
  },
};