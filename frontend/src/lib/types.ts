export enum UserRole {
  VIEWER = 'VIEWER',
  ENGINEER = 'ENGINEER',
  ADMIN = 'ADMIN',
}

export enum ServiceStatus {
  UP = 'UP',
  DEGRADED = 'DEGRADED',
  DOWN = 'DOWN',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
  incidents?: Incident[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  isPublic: boolean;
  rootCauseSummary: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  serviceId: string | null;
  createdById: string | null;
  service?: Service | null;
  createdBy?: User | null;
  updates?: Update[];
}

export interface Update {
  id: string;
  content: string;
  createdAt: string;
  incidentId: string;
  userId: string;
  user?: User;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface IncidentFilters {
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  serviceId?: string;
  startDate?: string;
  endDate?: string;
}
