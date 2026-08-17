import {
    Op,
    where
} from "sequelize";
import Branch from "../../models/branch.model.js";
import sequelize from "../db/sequelize.js";
import Permission from "../../models/permission.model.js";
import User from "../../models/user.model.js"
/* ================= GET ALL PermissionS ================= */
export const getPermissions = async (req, res) => {
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
        } = await Permission.findAndCountAll({
            where,
            limit: perPage,
            offset,
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                model: User,
                as: "user"
            }]
        });

        return res.status(200).json({
            success: true,
            message: "Permissions fetched successfully.",
            data: rows,
            page: currentPage,
            totalPages: Math.ceil(count / perPage),
            totalData: count,
        });

    } catch (error) {
        console.error("Error fetching Permissions:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Permissions.",
            error: "Internal server error.",
        });
    }
};

export const getPermissionByUserId = async (req, res) => {
    const {
        userId
    } = req.params;
    try {
        const result = await Permission.findAll({
            where: {
                user_id: userId,
            }
        });

        res.json({
            success: true,
            data: result || null,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

/* ================= GET BRANCH BY ID ================= */
export const getPermissionById = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const permission = await Permission.findByPk(id);

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Permission fetched successfully.",
            data: permission,
        });

    } catch (error) {
        console.error("Error fetching Permission:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Permission.",
            error: "Internal server error.",
        });
    }
};

/* ================= CREATE BRANCH ================= */
export const createPermission = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            permission_type,
            start_date,
            end_date,
            start_time,
            end_time,
            description,
            attachment_url,
        } = req.body;

        const {
            userId
        } = req.query;

        // VALIDATION (sesuai schema baru)
        if (
            !userId ||
            !permission_type ||
            !start_date ||
            !end_date ||
            !description
        ) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                error: "Required fields are missing.",
            });
        }

        // optional: normalize date (kalau frontend kirim ISO)
        const normalizeDate = (date) => {
            return new Date(date).toISOString().split("T")[0];
        };

        const permission = await Permission.create({
            user_id: userId,
            permission_type,
            start_date: normalizeDate(start_date),
            end_date: normalizeDate(end_date),
            start_time: start_time || null,
            end_time: end_time || null,
            description,
            attachment_url: attachment_url || null,
        }, {
            transaction
        });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Permission created successfully.",
            data: permission,
        });
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error creating Permission:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create Permission.",
            error: "Internal server error.",
        });
    }
};

/* ================= UPDATE BRANCH ================= */
export const updatePermission = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            id
        } = req.params;

        const {
            status,
            description,
            imageUrl
        } = req.body;

        if (
            !id
        ) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                error: "All fields are required.",
            });
        }

        const permission = await Permission.findByPk(id, {
            transaction
        });

        if (!permission) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Permission not found.",
            });
        }

        await Permission.update({
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
            message: "Permission updated successfully.",
            data: Permission,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error updating Permission:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update Permission.",
            error: "Internal server error.",
        });
    }
};

/* ================= DELETE BRANCH ================= */
export const deletePermission = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            id
        } = req.params;

        const permission = await Permission.findByPk(id, {
            transaction
        });

        if (!permission) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Permission not found.",
            });
        }

        // delete specific branch
        await permission.destroy({
            transaction
        });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Permission deleted successfully.",
            data: permission,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error deleting Permission:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete Permission.",
            error: "Internal server error.",
        });
    }
};