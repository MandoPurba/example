import {
    Op
} from "sequelize";
import Branch from "../../models/branch.model.js";
import sequelize from "../db/sequelize.js";
import User from "../../models/user.model.js";
/* ================= GET ALL BRANCHES ================= */
export const getBranches = async (req, res) => {
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
                    {
                        city: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        address: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                ],
            };
        }

        const {
            count,
            rows
        } = await Branch.findAndCountAll({
            where,
            limit: perPage,
            offset,
            order: [
                ["createdAt", "DESC"]
            ],
        });

        return res.status(200).json({
            success: true,
            message: "Branches fetched successfully.",
            data: rows,
            page: currentPage,
            totalPages: Math.ceil(count / perPage),
            totalData: count,
        });

    } catch (error) {
        console.error("Error fetching branches:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch branches.",
            error: "Internal server error.",
        });
    }
};

export const getBranchById = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const branch = await Branch.findByPk(id);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Branch fetched successfully.",
            data: branch,
        });

    } catch (error) {
        console.error("Error fetching branch:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch branch.",
            error: "Internal server error.",
        });
    }
};

/* ================= GET BRANCH BY USER ID ================= */
export const getBranchByuser_id = async (req, res) => {
    try {
        const {
            user_id
        } = req.params;

        const userBranch = await User.findByPk(user_id, {
            include: [{
                model: Branch,
                as: "branches",
                through: {
                    attributes: []
                }
            }]
        });

        if (!userBranch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Branch fetched successfully.",
            data: userBranch,
        });

    } catch (error) {
        console.error("Error fetching branch:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch branch.",
            error: "Internal server error.",
        });
    }
};

/* ================= CREATE BRANCH ================= */
export const createBranch = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            name,
            code,
            city,
            address,
            radius,
            latitude,
            longitude,
        } = req.body;

        if (
            !name ||
            !code ||
            !city ||
            !address ||
            radius === undefined ||
            latitude === undefined ||
            longitude === undefined
        ) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                error: "All fields are required.",
            });
        }

        const branch = await Branch.create({
            name,
            code,
            city,
            address,
            radius,
            latitude,
            longitude,
        }, {
            transaction
        });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Branch created successfully.",
            data: branch,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error creating branch:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create branch.",
            error: "Internal server error.",
        });
    }
};

/* ================= UPDATE BRANCH ================= */
export const updateBranch = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            id
        } = req.params;

        const {
            name,
            code,
            city,
            address,
            isActive,
            radius,
            latitude,
            longitude,
        } = req.body;

        if (
            !name ||
            !code ||
            !city ||
            !address ||
            radius === undefined ||
            latitude === undefined ||
            longitude === undefined
        ) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                error: "All fields are required.",
            });
        }

        const branch = await Branch.findByPk(id, {
            transaction
        });

        if (!branch) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Branch not found.",
            });
        }

        await branch.update({
            name,
            code,
            city,
            address,
            radius,
            isActive,
            latitude,
            longitude,
        }, {
            transaction
        });

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "Branch updated successfully.",
            data: branch,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error updating branch:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update branch.",
            error: "Internal server error.",
        });
    }
};

/* ================= DELETE BRANCH ================= */
export const deleteBranch = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            id
        } = req.params;

        const branch = await Branch.findByPk(id, {
            transaction
        });

        if (!branch) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Branch not found.",
            });
        }

        // delete specific branch
        await branch.destroy({
            transaction
        });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Branch deleted successfully.",
            data: branch,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error deleting branch:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete branch.",
            error: "Internal server error.",
        });
    }
};