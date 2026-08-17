import User from '../../models/user.model.js';
import UserBranch from '../../models/user_branch.model.js';
import Branch from '../../models/branch.model.js';
import sequelize from '../db/sequelize.js';
import bcrypt from 'bcrypt';
import UserProfile from '../../models/user_profile.model.js';
import UserShiftSchedule from '../../models/user_shift_schedule.model.js';
import Shift from '../../models/shift.js';
import VectorFace from '../../models/vector_face.model.js';

// =================== GET ALL USERS ===================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
          model: Branch,
          as: "branches",
          through: {
            attributes: []
          },
        },
        {
          model: UserProfile,
          as: "user_profile",
        },
        {
          model: VectorFace,
          as: "vector_face",
          attributes: ["image"]
        }
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully.',
      data: users
    });

  } catch (err) {
    console.error('Error fetching users:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users.',
      error: 'Internal server error.'
    });
  }
};

// =================== GET USER BY ID ===================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
          model: Branch,
          as: "branches",
          through: {
            attributes: []
          }
        },
        {
          model: UserProfile,
          as: "user_profile",
          include: [{
            model: Shift,
            as: "shift"
          }]
        },
        {
          model: UserShiftSchedule,
          as: "shift_schedules",
        },
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'User not found.'
      });
    }

    const branch_ids = user.branches.map(branch => branch.id);
    const workDates = user.shift_schedules.map(workDate => {
      return {
        date: workDate.workDate,
        status: workDate.status
      }
    });
console.log('User Shift Schedules:', user);
    return res.status(200).json({
      success: true,
      message: 'User fetched successfully.',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        username: user.username,
        branch_ids,
        user_profile: user.user_profile,
        shift_id: user.user_profile.shift_id || "",
        workDates,
      },
    });

  } catch (err) {
    console.error('Error fetching user by ID:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user.',
      error: 'Internal server error.'
    });
  }
};

// =================== CREATE USER ===================
export const createUser = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      username,
      password,
      branch_ids,
      shift_id,
      department_id,
      user_profile,
      workDates,
      statusDay
    } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (
      !username ||
      !password ||
      !department_id ||
      !shift_id ||
      !branch_ids ||
      !Array.isArray(branch_ids) ||
      branch_ids.length === 0
    ) {
      await t.rollback();

      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        error: "All fields are required, including at least one branch."
      });
    }

    const {
      name,
      email,
      status,
      image
    } = user_profile || {};

    // =========================
    // CHECK USERNAME
    // =========================
    const existingUser = await User.findOne({
      where: {
        username
      },
      transaction: t
    });

    if (existingUser) {
      await t.rollback();

      return res.status(409).json({
        success: false,
        message: "Username already exists.",
        error: "User with this username already exists."
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================
    const hashPassword = await bcrypt.hash(
      password,
      10
    );

    // =========================
    // CREATE USER
    // =========================
    const user = await User.create({
      name,
      email,
      username,
      password: hashPassword,
    }, {
      transaction: t
    });

    // =========================
    // CREATE PROFILE
    // =========================
    await UserProfile.create({
      user_id: user.id,
      shift_id: shift_id,
      department_id: department_id,
      name,
      email,
      status,
      image
    }, {
      transaction: t
    });

    if (Array.isArray(workDates) && workDates.length > 0) {
      await UserShiftSchedule.bulkCreate(
        workDates.map((item) => ({
          user_id: user.id,
          workDate: item.date,
          status: item.status,
        })), {
          transaction: t
        }
      );
    }


    // =========================
    // CREATE USER BRANCH
    // =========================
    const userBranches =
      await UserBranch.bulkCreate(
        branch_ids.map((branch_id) => ({
          user_id: user.id,
          branch_id
        })), {
          transaction: t
        }
      );

    // =========================
    // COMMIT
    // =========================
    await t.commit();

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
    });

  } catch (err) {

    if (!t.finished) {
      await t.rollback();
    }

    console.error(
      "Error creating user:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create user.",
      error: "Internal server error."
    });
  }
};

// =================== UPDATE USER ===================
export const updateUser = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      id
    } = req.params;

    const {
      username,
      password,
      isActive,
      branch_ids,
      shift_id,
      department_id,
      user_profile,
      workDates
    } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (
      !username ||
      !branch_ids ||
      !shift_id ||
      !department_id ||
      !Array.isArray(branch_ids) ||
      branch_ids.length === 0
    ) {
      await t.rollback();

      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        error: "username, and branch_ids are required."
      });
    }

    // =========================
    // FIND USER
    // =========================
    const user = await User.findByPk(id, {
      include: [{
        model: UserProfile,
        as: "user_profile",
      }],
      transaction: t
    });

    if (!user) {
      await t.rollback();

      return res.status(404).json({
        success: false,
        message: "User not found.",
        error: "User not found."
      });
    }

    // =========================
    // CHECK USERNAME (kalau berubah)
    // =========================
    if (username !== user.username) {
      const existing = await User.findOne({
        where: {
          username
        },
        transaction: t
      });

      if (existing) {
        await t.rollback();

        return res.status(409).json({
          success: false,
          message: "Username already exists.",
          error: "Username already exists."
        });
      }
    }

    // =========================
    // UPDATE USER
    // =========================
    const userUpdate = {
      username,
      isActive
    };

    if (password) {
      userUpdate.password = await bcrypt.hash(password, 10);
    }

    await User.update(userUpdate, {
      where: {
        id
      },
      transaction: t
    });

    // =========================
    // UPDATE PROFILE (sinkron dengan createUser)
    // =========================
    const {
      name,
      email,
      status,
      image,
      phone
    } = user_profile || {};

    await UserProfile.update({
      name,
      email,
      status,
      image,
      phone,
      shift_id,
      department_id
    }, {
      where: {
        user_id: id
      },
      transaction: t
    });

    // =========================
    // UPDATE USER BRANCH
    // =========================
    await UserBranch.destroy({
      where: {
        user_id: id
      },
      transaction: t
    });

    await UserBranch.bulkCreate(
      branch_ids.map((branch_id) => ({
        user_id: id,
        branch_id
      })), {
        transaction: t
      }
    );

    // =========================
    // UPDATE SHIFT SCHEDULE (SAMA DENGAN CREATE)
    // =========================
    await UserShiftSchedule.destroy({
      where: {
        user_id: id
      },
      transaction: t
    });

    if (Array.isArray(workDates) && workDates.length > 0) {
      await UserShiftSchedule.bulkCreate(
        workDates.map((item) => ({
          user_id: id,
          workDate: item.date,
          status: item.status
        })), {
          transaction: t
        }
      );
    }

    // =========================
    // COMMIT
    // =========================
    await t.commit();

    // =========================
    // GET UPDATED USER
    // =========================
    const updatedUser = await User.findByPk(id, {
      include: [{
          model: Branch,
          as: "branches",
          through: {
            attributes: []
          }
        },
        {
          model: UserProfile,
          as: "user_profile"
        },
        {
          model: UserShiftSchedule,
          as: "shift_schedules"
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser
    });

  } catch (err) {
    if (!t.finished) await t.rollback();

    console.error("Error updating user:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to update user.",
      error: "Internal server error."
    });
  }
};
// =================== DELETE USER ===================
export const deleteUser = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      id
    } = req.params;

    const user = await User.findByPk(id, {
      transaction: t
    });

    if (!user) {
      await t.rollback();

      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'User not found.'
      });
    }

    // delete relation first
    await UserBranch.destroy({
      where: {
        user_id: id
      },
      transaction: t
    });

    // delete profile
    await UserProfile.destroy({
      where: {
        user_id: id
      },
      transaction: t
    });

    // delete user
    await user.destroy({
      transaction: t
    });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
      data: user
    });

  } catch (err) {

    if (!t.finished) {
      await t.rollback();
    }

    console.error('Error deleting user:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete user.',
      error: 'Internal server error.'
    });
  }
};