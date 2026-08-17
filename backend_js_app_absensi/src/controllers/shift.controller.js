import {
    Op,
    where
} from "sequelize";
import Branch from "../../models/branch.model.js";
import sequelize from "../db/sequelize.js";
import Shift from "../../models/shift.js";
/* ================= GET ALL ShiftS ================= */
export const getShifts = async (req, res) => {
    try {
        const {
            search = "",
                page = 1,
                limit = 5,
        } = req.query;

        const currentPage = parseInt(page);
        const perPage = parseInt(limit);
        const offset = (currentPage - 1) * perPage;

        let where = {};

        if (search) {
            where = {
                [Op.or]: [{
                        name: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        code: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                ],
            };
        }

        const {
            count,
            rows
        } = await Shift.findAndCountAll({
            where,
            limit: perPage,
            offset,
            order: [
                ["createdAt", "DESC"]
            ],
        });

        return res.status(200).json({
            success: true,
            message: "Shifts fetched successfully.",
            data: rows,
            page: currentPage,
            totalPages: Math.ceil(count / perPage),
            totalData: count,
        });

    } catch (error) {
        console.error("Error fetching Shifts:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Shifts.",
            error: "Internal server error.",
        });
    }
};

/* ================= GET BRANCH BY ID ================= */
export const getShiftById = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const shift = await Shift.findByPk(id);

        if (!shift) {
            return res.status(404).json({
                success: false,
                message: "Shift not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Shift fetched successfully.",
            data: branch,
        });

    } catch (error) {
        console.error("Error fetching shift:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch shift.",
            error: "Internal server error.",
        });
    }
};

/* ================= CREATE BRANCH ================= */
export const createShift = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            name,
            startTime,
            endTime,
            crossDay,
            graceMinutes,
            description
        } = req.body;

        if (
            !name ||
            !startTime ||
            !endTime ||
            !graceMinutes
        ) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                error: "All fields are required.",
            });
        }

        const code = `SFT-${Math.floor(Math.random() * 1000)
  .toString()
  .padStart(3, "0")}`;

        const shift = await Shift.create({
            name,
            code,
            crossDay,
            startTime,
            endTime,
            graceMinutes,
            description
        }, {
            transaction
        });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Shift created successfully.",
            data: shift,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error creating shift:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create shift.",
            error: "Internal server error.",
        });
    }
};

/* ================= UPDATE BRANCH ================= */
export const updateShift = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            id
        } = req.params;

        const {
            name,
            startTime,
            endTime,
            crossDay,
            graceMinutes,
            description
        } = req.body;

        if (
            !name ||
            !startTime ||
            !endTime ||
            !graceMinutes
        ) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                error: "All fields are required.",
            });
        }

        const shift = await Shift.findByPk(id, {
            transaction
        });

        if (!shift) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Shift not found.",
            });
        }

        await Shift.update({
            name,
            startTime,
            endTime,
            crossDay,
            graceMinutes,
            description
        }, {
            where: {
                id
            }
        }, {
            transaction
        });

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "shift updated successfully.",
            data: shift,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error updating shift:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update shift.",
            error: "Internal server error.",
        });
    }
};

/* ================= DELETE BRANCH ================= */
export const deleteShift = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            id
        } = req.params;

        const shift = await Shift.findByPk(id, {
            transaction
        });

        if (!shift) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Shift not found.",
            });
        }

        // delete specific branch
        await shift.destroy({
            transaction
        });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Shift deleted successfully.",
            data: shift,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error deleting shift:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete shift.",
            error: "Internal server error.",
        });
    }
};