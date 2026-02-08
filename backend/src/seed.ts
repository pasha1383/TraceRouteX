import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { seedDatabase } from './utils/seeder';

dotenv.config();

const runSeeder = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    // Run seeder
    await seedDatabase();

    // Close connection
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
