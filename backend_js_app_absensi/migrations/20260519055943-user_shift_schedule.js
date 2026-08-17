'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_shift_schedule', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      workDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM(
          'schedule',
          'off',
          'leave'
        ),
        defaultValue: 'schedule'
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      }
    });

    await queryInterface.addConstraint(
      'user_shift_schedule',
      {
        fields: ['user_id', 'workDate'],
        type: 'unique',
        name: 'unique_user_schedule_per_day'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_shift_schedule');
  }
};