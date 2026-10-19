/**
 * Arquivo mantido para retrocompatibilidade.
 * DTOs organizados em:
 *  - Request: ./request/authDTO.js
 *  - Response: ./response/authDTO.js
 */
export * from './request/authDTO.js';
export * from './response/authDTO.js';

import requestDTOs from './request/authDTO.js';
import responseDTOs from './response/authDTO.js';

export default {
  ...requestDTOs,
  ...responseDTOs
};
