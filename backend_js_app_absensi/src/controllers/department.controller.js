import {
    Op
} from "sequelize";
import sequelize from "../db/sequelize.js";
import User from "../../models/user.model.js";
import Department from "../../models/department.model.js";
import AccessRouteDepartment from "../../models/access_route_department.model.js";

export const getDepartments = async (req, res) => {
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
        } = await Department.findAndCountAll({
            where,
            limit: perPage,
            offset,
            order: [
                ["createdAt", "DESC"]
            ],
        });

        return res.status(200).json({
            success: true,
            message: "Departments fetched successfully.",
            data: rows,
            page: currentPage,
            totalPages: Math.ceil(count / perPage),
            totalData: count,
        });

    } catch (error) {
        console.error("Error fetching departments:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch departments.",
            error: "Internal server error.",
        });
    }
};

export const getDepartmentById = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const department = await Department.findByPk(id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Department fetched successfully.",
            data: department,
        });

    } catch (error) {
        console.error("Error fetching department:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch department.",
            error: "Internal server error.",
        });
    }
};

export const createDepartment = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            name,
        } = req.body;

        if (
            !name
        ) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                error: "All fields are required.",
            });
        }


        const code = `DPT-${Math.floor(Math.random() * 1000)
  .toString()
  .padStart(3, "0")}`;

        const department = await Department.create({
            name,
            code,
        }, {
            transaction
        });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Department created successfully.",
            data: department,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error creating department:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create department.",
            error: "Internal server error.",
        });
    }
};

export const updateDepartment = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            id
        } = req.params;

        const {
            name,
            code,
            isActive
        } = req.body;

        if (
            !name ||
            !code
        ) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                error: "All fields are required.",
            });
        }

        const department = await Department.findByPk(id, {
            transaction
        });

        if (!department) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Department not found.",
            });
        }

        await department.update({
            name,
            code,
            isActive
        }, {
            transaction
        });

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "Department updated successfully.",
            data: department,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error updating department:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update department.",
            error: "Internal server error.",
        });
    }
};

export const deleteDepartment = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            id
        } = req.params;

        const department = await Department.findByPk(id, {
            transaction
        });

        if (!department) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Department not found.",
            });
        }

        await department.destroy({
            transaction
        });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Department deleted successfully.",
            data: department,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error deleting department:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete department.",
            error: "Internal server error.",
        });
    }
};