/**
 * Arquivo mantido para retrocompatibilidade.
 * DTOs organizados em:
 *  - Request: ./request/userDTO.js
 *  - Response: ./response/userDTO.js
 */
export * from './request/userDTO.js';
export * from './response/userDTO.js';

import requestDTOs from './request/userDTO.js';
import responseDTOs from './response/userDTO.js';

export default {
  ...requestDTOs,
  ...responseDTOs
};
