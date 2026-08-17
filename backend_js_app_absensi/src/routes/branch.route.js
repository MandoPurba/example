import express from 'express';
import {
    createBranch,
    deleteBranch,
    getBranchById,
    getBranchByuser_id,
    getBranches,
    updateBranch
} from '../controllers/branch.controller.js';
const router = express.Router();

router.get('/', getBranches);
router.get('/:id', getBranchById);
router.get('/user/:user_id', getBranchByuser_id);

router.post('/', createBranch);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

export default router;