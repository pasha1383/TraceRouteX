import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Update } from './Update';
import { Service } from './Service';
import { User } from './User';

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED'
}

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'enum',
    enum: IncidentSeverity,
    default: IncidentSeverity.MEDIUM
  })
  severity!: IncidentSeverity;

  @Column({
    type: 'enum',
    enum: IncidentStatus,
    default: IncidentStatus.OPEN
  })
  status!: IncidentStatus;

  @Column({ default: false })
  isPublic!: boolean;

  @Column({ type: 'text', nullable: true })
  rootCauseSummary!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Service, service => service.incidents, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service!: Service | null;

  @Column({ nullable: true })
  serviceId!: string | null;

  @ManyToOne(() => User, user => user.incidents, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User | null;

  @Column({ nullable: true })
  createdById!: string | null;

  @OneToMany(() => Update, update => update.incident)
  updates!: Update[];
}
