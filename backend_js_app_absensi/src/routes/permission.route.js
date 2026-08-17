import express from 'express';
import { getPermissions, getPermissionById, createPermission, updatePermission, deletePermission, getPermissionByUserId } from '../controllers/permission.controller.js';
const router = express.Router();

router.get('/', getPermissions);
router.get('/:id', getPermissionById);
router.get('/user/:user_id', getPermissionByUserId);
router.post('/', createPermission);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);

export default router;