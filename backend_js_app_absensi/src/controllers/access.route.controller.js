import {
    Op
} from "sequelize";
import sequelize from "../db/sequelize.js";
import User from "../../models/user.model.js";
import AccessRouteDepartment from "../../models/access_route_department.model.js";
import Department from "../../models/department.model.js";
// import SubItemAccessRouteDepartment from "../../models/sub_item_access_route_department.model.js";
import FrontendRoute from "../../models/frontend_route.model.js";
import SubItemFrontendRoute from "../../models/subitem_frontend_route.model.js";
import BackendRoute from "../../models/backend_route.model.js";
import VectorFace from "../../models/vector_face.model.js";

export const getAccessRoutes = async (req, res) => {
    try {
        const {
            search = "",
                page = 1,
                limit = 30,
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
        } = await FrontendRoute.findAndCountAll({
            where,
            limit: perPage,
            offset,
            order: [
                ["createdAt", "DESC"]
            ],
            include: [{
                model: SubItemFrontendRoute,
                as: "sub_items",
                attributes: ["id", "name", "path", "isActive", "createdAt", "updatedAt"],
            }]
        });

        return res.status(200).json({
            success: true,
            message: "access_routes fetched successfully.",
            data: rows,
            page: currentPage,
            totalPages: Math.ceil(count / perPage),
            totalData: count,
        });

    } catch (error) {
        console.error("Error fetching access_routes:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch access_routes.",
            error: "Internal server error.",
        });
    }
};

export const getAccessRouteByDepartmentId = async (req, res) => {
    try {
        const {
            department_id,
            user_id,
            is_access_route_control
        } = req.query;
        console.log("is_access_route_control:", is_access_route_control);
        const department = await Department.findByPk(department_id, {
            include: [{
                    model: FrontendRoute,
                    as: "frontend_access_routes",
                    through: {
                        attributes: [],
                    },
                    include: [{
                        model: BackendRoute,
                        as: "backend_routes",
                        through: {
                            attributes: [],
                        },
                    }, ],
                },
                {
                    model: SubItemFrontendRoute,
                    as: "subitem_access_routes",
                    through: {
                        attributes: [],
                    },
                    include: [{
                        model: FrontendRoute,
                        as: "frontend_route",
                    }, ],
                },
            ],
        });

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        const data = department.toJSON();

        // ==========================================
        // HIDE REGISTER FACE IF ALREADY REGISTERED
        // ==========================================

        const isAccessRouteControl =
            is_access_route_control === "true";

        if (user_id && !isAccessRouteControl) {
            const hasFace =
                (await VectorFace.count({
                    where: {
                        user_id,
                    },
                })) > 0;

            if (hasFace) {
                data.frontend_access_routes =
                    data.frontend_access_routes.filter(
                        (route) =>
                        route.path !==
                        "/bio-metrics/face-recognition"
                    );
            }
        }

        // ==========================================
        // SORT FRONTEND ROUTES
        // ==========================================
        data.frontend_access_routes.sort(
            (a, b) => (a.sort || 0) - (b.sort || 0)
        );

        // ==========================================
        // GROUP SUBITEMS
        // ==========================================
        const groupedSubItems = Object.values(
            data.subitem_access_routes.reduce((acc, item) => {
                const parent = item.frontend_route;

                if (!parent) return acc;

                if (!acc[parent.id]) {
                    acc[parent.id] = {
                        id: parent.id,
                        name: parent.name,
                        icon: parent.icon,
                        path: parent.path,
                        sort: parent.sort || 0,
                        isActive: parent.isActive,
                        children: [],
                    };
                }

                acc[parent.id].children.push({
                    id: item.id,
                    name: item.name,
                    path: item.path,
                    sort: item.sort || 0,
                    isActive: item.isActive,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                });

                return acc;
            }, {})
        );

        // ==========================================
        // SORT CHILDREN
        // ==========================================
        groupedSubItems.forEach((group) => {
            group.children.sort(
                (a, b) => (a.sort || 0) - (b.sort || 0)
            );
        });

        // ==========================================
        // SORT GROUPS
        // ==========================================
        groupedSubItems.sort(
            (a, b) => (a.sort || 0) - (b.sort || 0)
        );

        const result = {
            ...data,
            subitem_access_routes: groupedSubItems,
        };

        return res.status(200).json({
            success: true,
            message: "Department fetched successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error fetching department:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch department",
            error: error.message,
        });
    }
};

export const createAccessRoute = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            name,
            icon,
            path,
            child,
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


        const access_route = await AccessRoute.create({
            name,
            icon,
            path,
            child
        }, {
            transaction
        });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Access Route created successfully.",
            data: access_route,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error creating Access Route:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create Access Route.",
            error: "Internal server error.",
        });
    }
};

export const updateAccessRouteDepartment = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            frontendRouteIds,
            subitemFrontendRouteIds,
        } = req.body;

        console.log("Received frontendRouteIds:", frontendRouteIds);
        console.log("Received subitemFrontendRouteIds:", subitemFrontendRouteIds);

        const {
            department_id
        } = req.params;

        if (!Array.isArray(frontendRouteIds)) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                error: "frontendRouteIds must be an array.",
            });
        }

        const department = await Department.findByPk(department_id, {
            transaction
        });

        if (!department) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: "Department not found.",
            });
        }

        // ❌ HAPUS SEMUA ACCESS LAMA (bukan department)
        await AccessRouteDepartment.destroy({
            where: {
                department_id
            },
            transaction
        });

        const payload = frontendRouteIds.map((routeId) => ({
            department_id,
            frontend_route_id: routeId,
            subitem_frontend_route_id: null,
        }));

        if (Array.isArray(subitemFrontendRouteIds) && subitemFrontendRouteIds.length > 0) {
            subitemFrontendRouteIds.forEach((subId) => {
                payload.push({
                    department_id,
                    frontend_route_id: null,
                    subitem_frontend_route_id: subId,
                });
            });
        }

        const access_route_department = await AccessRouteDepartment.bulkCreate(payload, {
            transaction
        });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Access Routes updated successfully.",
            data: access_route_department,
        });

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Error updating Access Route:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update Access Route.",
            error: "Internal server error.",
        });
    }
};

// export const deleteAccessRoute = async (req, res) => {
//     const transaction = await sequelize.transaction();

//     try {
//         const {
//             id
//         } = req.params;

//         const del = await AccessRoute.findByPk(id, {
//             transaction
//         });

//         if (!del) {
//             await transaction.rollback();

//             return res.status(404).json({
//                 success: false,
//                 message: "AccessRoute not found.",
//             });
//         }

//         await del.destroy({
//             transaction
//         });

//         await transaction.commit();

//         return res.status(200).json({
//             success: true,
//             message: "AccessRoute deleted successfully.",
//             data: del,
//         });

//     } catch (error) {
//         if (!transaction.finished) {
//             await transaction.rollback();
//         }

//         console.error("Error deleting AccessRoute:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to delete AccessRoute.",
//             error: "Internal server error.",
//         });
//     }
// };