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

    // Create Users
    console.log('👤 Creating users...');
    const adminPassword = await hashPassword('admin123');
    const engineerPassword = await hashPassword('engineer123');
    const viewerPassword = await hashPassword('viewer123');

    const admin = userRepository.create({
      email: 'admin@example.com',
      password: adminPassword,
      role: UserRole.ADMIN
    });
    await userRepository.save(admin);

    const engineer1 = userRepository.create({
      email: 'engineer@example.com',
      password: engineerPassword,
      role: UserRole.ENGINEER
    });
    await userRepository.save(engineer1);

    const engineer2 = userRepository.create({
      email: 'engineer2@example.com',
      password: engineerPassword,
      role: UserRole.ENGINEER
    });
    await userRepository.save(engineer2);

    const viewer = userRepository.create({
      email: 'viewer@example.com',
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
        status: ServiceStatus.UP
      },
      {
        name: 'Authentication Service',
        description: 'User authentication and authorization service',
        status: ServiceStatus.UP
      },
      {
        name: 'Database Cluster',
        description: 'PostgreSQL database cluster for data persistence',
        status: ServiceStatus.UP
      },
      {
        name: 'CDN Network',
        description: 'Content delivery network for static assets',
        status: ServiceStatus.DEGRADED
      },
      {
        name: 'Email Service',
        description: 'Email notification and delivery service',
        status: ServiceStatus.UP
      },
      {
        name: 'Payment Gateway',
        description: 'Payment processing and transaction management',
        status: ServiceStatus.UP
      },
      {
        name: 'Analytics Engine',
        description: 'Real-time analytics and data processing',
        status: ServiceStatus.DOWN
      }
    ];

    const createdServices: Service[] = [];
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
        status: IncidentStatus.OPEN,
        isPublic: true,
        serviceId: createdServices[0].id,
        createdById: engineer1.id
      },
      {
        title: 'CDN Performance Degradation',
        description: 'CDN edge nodes in EU region showing degraded performance. Users may experience slower load times.',
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.OPEN,
        isPublic: true,
        serviceId: createdServices[3].id,
        createdById: engineer2.id
      },
      {
        title: 'Scheduled Database Maintenance',
        description: 'Planned maintenance window for database cluster upgrade. No impact expected.',
        severity: IncidentSeverity.LOW,
        status: IncidentStatus.OPEN,
        isPublic: true,
        serviceId: createdServices[2].id,
        createdById: admin.id
      },
      {
        title: 'Payment Gateway Intermittent Errors',
        description: 'Some payment transactions failing intermittently. Vendor has been notified.',
        severity: IncidentSeverity.CRITICAL,
        status: IncidentStatus.RESOLVED,
        isPublic: true,
        serviceId: createdServices[5].id,
        createdById: engineer1.id,
        resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        rootCauseSummary: 'API version mismatch between gateway and payment processor. Updated to latest API version.'
      },
      {
        title: 'Internal API Rate Limiting Issue',
        description: 'Internal issue with rate limiting configuration. Not affecting customers.',
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.RESOLVED,
        isPublic: false,
        serviceId: createdServices[0].id,
        createdById: engineer1.id,
        resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        rootCauseSummary: 'Rate limiter configuration was too aggressive. Adjusted threshold values.'
      }
    ];

    const createdIncidents: Incident[] = [];
    for (const incidentData of incidents) {
      const incident = incidentRepository.create(incidentData);
      await incidentRepository.save(incident);
      createdIncidents.push(incident);
    }

    console.log('✅ Incidents created successfully');

    // Create Updates for incidents
    console.log('📝 Creating incident updates...');
    const updates = [
      {
        content: 'Incident detected. DevOps team has been notified and is investigating.',
        incidentId: createdIncidents[0].id,
        userId: engineer1.id
      },
      {
        content: 'Root cause identified: Memory leak in session management. Deploying hotfix.',
        incidentId: createdIncidents[0].id,
        userId: engineer1.id
      },
      {
        content: 'CDN provider notified. Monitoring the situation closely.',
        incidentId: createdIncidents[1].id,
        userId: engineer2.id
      },
      {
        content: 'CDN provider confirmed issue with EU-West nodes. They are working on a fix.',
        incidentId: createdIncidents[1].id,
        userId: engineer2.id
      },
      {
        content: 'Issue identified with payment gateway API version mismatch.',
        incidentId: createdIncidents[3].id,
        userId: engineer1.id
      },
      {
        content: 'Updated to latest API version. Testing in progress.',
        incidentId: createdIncidents[3].id,
        userId: engineer1.id
      },
      {
        content: 'Fix deployed successfully. All payment transactions working normally. Monitoring for 24 hours.',
        incidentId: createdIncidents[3].id,
        userId: engineer1.id
      }
    ];

    for (const updateData of updates) {
      const update = updateRepository.create(updateData);
      await updateRepository.save(update);
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
    console.log('  Admin:     admin@example.com / admin123');
    console.log('  Engineer:  engineer@example.com / engineer123');
    console.log('  Engineer:  engineer2@example.com / engineer123');
    console.log('  Viewer:    viewer@example.com / viewer123\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
