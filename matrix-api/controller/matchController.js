import { MatchService } from '../service/matchService.js';
import { matchResponseDTO, matchListResponseDTO } from '../dtos/response/matchDTO.js';

export const MatchController = {
  async createMatch(req, res, next) {
    try {
      const hostUser = req.user || {
        id: req.body?.userId,
        username: req.body?.username
      };
      const match = await MatchService.createMatch(hostUser);
      const responseData = matchResponseDTO.parse(match);

      res.status(201).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  },

  async joinMatch(req, res, next) {
    try {
      const { matchId } = req.params;
      const guestUser = req.user || {
        id: req.body?.userId,
        username: req.body?.username
      };
      const match = await MatchService.joinMatch(matchId, guestUser);
      const responseData = matchResponseDTO.parse(match);

      res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  },

  async makeMove(req, res, next) {
    try {
      const { matchId } = req.params;
      const { moveIndex, userId } = req.body;
      const activeUserId = req.user?.id || userId;

      const match = await MatchService.makeMove(matchId, activeUserId, moveIndex);
      const responseData = matchResponseDTO.parse(match);

      res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  },

  async getMatch(req, res, next) {
    try {
      const { matchId } = req.params;
      const match = await MatchService.getMatch(matchId);
      const responseData = matchResponseDTO.parse(match);

      res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  },

  listMatches(req, res, next) {
    try {
      const matches = MatchService.getActiveMatches();
      const responseData = matchListResponseDTO.parse(matches);

      res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      next(error);
    }
  }
};

export default MatchController;
