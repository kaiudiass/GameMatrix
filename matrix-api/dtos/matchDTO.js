/**
 * Arquivo mantido para retrocompatibilidade.
 * DTOs organizados em:
 *  - Request: ./request/matchDTO.js
 *  - Response: ./response/matchDTO.js
 */
export * from './request/matchDTO.js';
export * from './response/matchDTO.js';

import requestDTOs from './request/matchDTO.js';
import responseDTOs from './response/matchDTO.js';

export default {
  ...requestDTOs,
  ...responseDTOs
};
