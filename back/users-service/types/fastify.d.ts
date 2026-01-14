import 'fastify';

declare module "multer";

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

interface MulterFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
}



export interface JwtPayload {
  id: number;
  username: string;
  iat: number;
}

import 'fastify';
import type { UpdateDataUserDTO } from '../dto/user.dto.ts';

declare module 'fastify' {
  interface FastifyRequest {
    _currentUser?: any;
    currentUser?: any;
  }

}
export type FastifyRequestFile = FastifyRequest<UpdateDataUserDTO> & {
  file?: MulterFile;
};

