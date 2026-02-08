import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entities/User';
import { Service } from './entities/Service';
import { Incident } from './entities/Incident';
import { Update } from './entities/Update';
import { AuditLog } from './entities/AuditLog';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'traceroute_db',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Service, Incident, Update, AuditLog],
  migrations: [],
  subscribers: [],
});
