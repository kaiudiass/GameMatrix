import { Router } from 'express';
import { MatchController } from '../controller/matchController.js';
import { validate, validateParams } from '../config/middleware/validationMiddleware.js';
import {
  createMatchRequestDTO,
  joinMatchRequestDTO,
  makeMoveRequestDTO,
  matchIdParamDTO
} from '../dtos/request/matchDTO.js';

const router = Router();

router.get('/', MatchController.listMatches);
router.post('/', validate(createMatchRequestDTO), MatchController.createMatch);
router.get('/:matchId', validateParams(matchIdParamDTO), MatchController.getMatch);
router.post('/:matchId/join', validateParams(matchIdParamDTO), validate(joinMatchRequestDTO), MatchController.joinMatch);
router.post('/:matchId/move', validateParams(matchIdParamDTO), validate(makeMoveRequestDTO), MatchController.makeMove);

export default router;
