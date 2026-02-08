import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Update } from './Update';
import { Incident } from './Incident';

export enum UserRole {
  VIEWER = 'VIEWER',
  ENGINEER = 'ENGINEER',
  ADMIN = 'ADMIN'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER
  })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Update, update => update.user)
  updates!: Update[];

  @OneToMany(() => Incident, incident => incident.createdBy)
  incidents!: Incident[];
}
