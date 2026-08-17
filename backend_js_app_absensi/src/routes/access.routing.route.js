import express from 'express';
import {
    // createAccessRoute,
    // deleteAccessRoute,
    updateAccessRouteDepartment,
    getAccessRouteByDepartmentId,
    getAccessRoutes,
} from '../controllers/access.route.controller.js';
const router = express.Router();

router.get('/frontend-route', getAccessRoutes);
router.get('/department/', getAccessRouteByDepartmentId);
router.put('/department/:department_id', updateAccessRouteDepartment);

// router.post('/', createAccessRoute);
// router.delete('/:id', deleteAccessRoute);

export default router;