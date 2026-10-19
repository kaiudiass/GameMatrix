import { Router } from 'express';
import { UserController } from '../controller/userController.js';
import { validateParams } from '../config/middleware/validationMiddleware.js';
import { userIdParamDTO } from '../dtos/request/userDTO.js';

const router = Router();

router.get('/', UserController.getUsers);
router.get('/:id', validateParams(userIdParamDTO), UserController.getUserById);

export default router;
