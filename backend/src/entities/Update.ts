import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Incident } from './Incident';
import { User } from './User';

@Entity('updates')
export class Update {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Incident, incident => incident.updates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'incidentId' })
  incident!: Incident;

  @Column()
  incidentId!: string;

  @ManyToOne(() => User, user => user.updates, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ nullable: true })
  userId!: string;
}
