import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

export interface JwtPayload {
  id: number;
  username: string;
  iat: number;
}

import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    _currentUser?: any;
    currentUser?: any;
  }
}


export type DataUserRequest = {
  data: {
    id: number;
    username: string;
    nbrVictory: number;
    nbrDefeat: number;
  };
};

export class DataStateUser {
 data: {
    state: boolean;
  };
}