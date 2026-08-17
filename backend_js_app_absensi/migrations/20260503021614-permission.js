'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hapus tabel lama jika ada
    await queryInterface.dropTable('permission');

    // Buat tabel baru
    await queryInterface.createTable('permissions', {
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
      },

      permission_type: {
        type: Sequelize.ENUM(
          'izin',
          'sakit',
          'cuti',
          'dinas_luar'
        ),
        allowNull: false,
      },

      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      start_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },

      end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      attachment_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      approval_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      approved_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id',
        },
      },

      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          'pending',
          'approved',
          'rejected'
        ),
        allowNull: false,
        defaultValue: 'pending',
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('permissions');
  },
};