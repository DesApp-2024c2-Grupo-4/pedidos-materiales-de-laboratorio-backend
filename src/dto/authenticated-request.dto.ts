import { AccessTokenPayload } from '../types/jwt-payload';

export interface AuthenticatedRequest extends Request {
  user: AccessTokenPayload;
}
