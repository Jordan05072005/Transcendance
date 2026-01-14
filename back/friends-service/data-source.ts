import typeorm = require('typeorm');
import 'reflect-metadata';
import { DataRequest, Friend } from './entity/user.entity.js';

export const AppDataSource = new typeorm.DataSource({
  type: 'sqlite',
  database: process.env.DB_DATABASE || './db/sqlite.db',
  synchronize: true,
  entities: [DataRequest, Friend],
});