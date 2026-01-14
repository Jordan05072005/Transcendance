import 'reflect-metadata';
import typeorm = require('typeorm');
import { Match } from './entity/match.entity.js';

export const AppDataSource = new typeorm.DataSource({
  type: 'sqlite',
  database: process.env.DB_DATABASE || './db/sqlite.db',
  synchronize: true,
  entities: [Match],
});
