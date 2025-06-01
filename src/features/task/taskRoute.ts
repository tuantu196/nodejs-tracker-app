import { Router } from 'express';

import * as taskController from './taskController.ts';
import { authenticate } from '../../middleware/authenticate.ts';

const router = Router();

router.post('/create', authenticate, taskController.createTask);
router.get('/list', authenticate, taskController.listTasks);
router.get('/detail/:id', authenticate, taskController.getTaskDetail);
router.put('/update/:id', authenticate, taskController.updateTask);
router.delete('/delete/:id', authenticate, taskController.deleteTask);

export default router;