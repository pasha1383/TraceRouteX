import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { Service, ServiceStatus } from '../entities/Service';
import { Incident, IncidentSeverity, IncidentStatus } from '../entities/Incident';
import { Update } from '../entities/Update';
import { hashPassword } from './password';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    const userRepository = AppDataSource.getRepository(User);
    const serviceRepository = AppDataSource.getRepository(Service);
    const incidentRepository = AppDataSource.getRepository(Incident);
    const updateRepository = AppDataSource.getRepository(Update);

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await updateRepository.delete({});
    // await incidentRepository.delete({});
    // await serviceRepository.delete({});
    // await userRepository.delete({});

    // Create Users
    console.log('👤 Creating users...');
    const adminPassword = await hashPassword('admin123');
    const engineerPassword = await hashPassword('engineer123');
    const viewerPassword = await hashPassword('viewer123');

    const admin = userRepository.create({
      email: 'admin@traceroutex.com',
      password: adminPassword,
      role: UserRole.ADMIN
    });
    await userRepository.save(admin);

    const engineer1 = userRepository.create({
      email: 'engineer1@traceroutex.com',
      password: engineerPassword,
      role: UserRole.ENGINEER
    });
    await userRepository.save(engineer1);

    const engineer2 = userRepository.create({
      email: 'engineer2@traceroutex.com',
      password: engineerPassword,
      role: UserRole.ENGINEER
    });
    await userRepository.save(engineer2);

    const viewer = userRepository.create({
      email: 'viewer@traceroutex.com',
      password: viewerPassword,
      role: UserRole.VIEWER
    });
    await userRepository.save(viewer);

    console.log('✅ Users created successfully');

    // Create Services
    console.log('🔧 Creating services...');
    const services = [
      {
        name: 'API Gateway',
        description: 'Main API gateway handling all incoming requests',
        status: ServiceStatus.OPERATIONAL
      },
      {
        name: 'Authentication Service',
        description: 'User authentication and authorization service',
        status: ServiceStatus.OPERATIONAL
      },
      {
        name: 'Database Cluster',
        description: 'PostgreSQL database cluster for data persistence',
        status: ServiceStatus.OPERATIONAL
      },
      {
        name: 'CDN Network',
        description: 'Content delivery network for static assets',
        status: ServiceStatus.DEGRADED
      },
      {
        name: 'Email Service',
        description: 'Email notification and delivery service',
        status: ServiceStatus.OPERATIONAL
      },
      {
        name: 'Payment Gateway',
        description: 'Payment processing and transaction management',
        status: ServiceStatus.OPERATIONAL
      },
      {
        name: 'Analytics Engine',
        description: 'Real-time analytics and data processing',
        status: ServiceStatus.MAINTENANCE
      }
    ];

    const createdServices = [];
    for (const serviceData of services) {
      const service = serviceRepository.create(serviceData);
      await serviceRepository.save(service);
      createdServices.push(service);
    }

    console.log('✅ Services created successfully');

    // Create Incidents
    console.log('🚨 Creating incidents...');
    const incidents = [
      {
        title: 'High CPU Usage on API Gateway',
        description: 'API Gateway servers experiencing unusually high CPU usage causing slow response times. Investigation ongoing.',
        severity: IncidentSeverity.HIGH,
        status: IncidentStatus.INVESTIGATING,
        isPublic: true
      },
      {
        title: 'CDN Performance Degradation',
        description: 'CDN edge nodes in EU region showing degraded performance. Users may experience slower load times.',
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.INVESTIGATING,
        isPublic: true
      },
      {
        title: 'Scheduled Database Maintenance',
        description: 'Planned maintenance window for database cluster upgrade. No impact expected.',
        severity: IncidentSeverity.LOW,
        status: IncidentStatus.OPEN,
        isPublic: true
      },
      {
        title: 'Payment Gateway Intermittent Errors',
        description: 'Some payment transactions failing intermittently. Vendor has been notified.',
        severity: IncidentSeverity.CRITICAL,
        status: IncidentStatus.RESOLVED,
        isPublic: true,
        resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        title: 'Internal API Rate Limiting Issue',
        description: 'Internal issue with rate limiting configuration. Not affecting customers.',
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.CLOSED,
        isPublic: false,
        resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    ];

    const createdIncidents = [];
    for (const incidentData of incidents) {
      const incident = incidentRepository.create(incidentData);
      await incidentRepository.save(incident);
      createdIncidents.push(incident);
    }

    console.log('✅ Incidents created successfully');

    // Create Updates for incidents
    console.log('📝 Creating incident updates...');
    const updates = [
      // Updates for High CPU incident
      {
        content: 'Incident detected. DevOps team has been notified and is investigating.',
        incident: createdIncidents[0],
        userId: engineer1.id
      },
      {
        content: 'Root cause identified: Memory leak in session management. Deploying hotfix.',
        incident: createdIncidents[0],
        userId: engineer1.id
      },
      // Updates for CDN incident
      {
        content: 'CDN provider notified. Monitoring the situation closely.',
        incident: createdIncidents[1],
        userId: engineer2.id
      },
      {
        content: 'CDN provider confirmed issue with EU-West nodes. They are working on a fix.',
        incident: createdIncidents[1],
        userId: engineer2.id
      },
      // Updates for resolved payment gateway incident
      {
        content: 'Issue identified with payment gateway API version mismatch.',
        incident: createdIncidents[3],
        userId: engineer1.id
      },
      {
        content: 'Updated to latest API version. Testing in progress.',
        incident: createdIncidents[3],
        userId: engineer1.id
      },
      {
        content: 'Fix deployed successfully. All payment transactions working normally. Monitoring for 24 hours.',
        incident: createdIncidents[3],
        userId: engineer1.id
      }
    ];

    for (const updateData of updates) {
      const update = updateRepository.create(updateData);
      await updateRepository.save(update);
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Updates created successfully');

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📋 Seeded Data Summary:');
    console.log('  - Users: 4 (1 Admin, 2 Engineers, 1 Viewer)');
    console.log('  - Services: 7');
    console.log('  - Incidents: 5');
    console.log('  - Updates: 7\n');
    console.log('🔐 Test Credentials:');
    console.log('  Admin:     admin@traceroutex.com / admin123');
    console.log('  Engineer:  engineer1@traceroutex.com / engineer123');
    console.log('  Engineer:  engineer2@traceroutex.com / engineer123');
    console.log('  Viewer:    viewer@traceroutex.com / viewer123\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
