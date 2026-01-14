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
