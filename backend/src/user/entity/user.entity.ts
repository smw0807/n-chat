import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SignUpType {
  EMAIL = 'EMAIL',
  KAKAO = 'KAKAO',
  GOOGLE = 'GOOGLE',
}

@Entity({
  name: 'TB_USER',
})
export class User {
  @PrimaryColumn({
    type: 'varchar',
    length: 25,
  })
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: SignUpType,
    default: SignUpType.EMAIL,
  })
  type: SignUpType;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastLoginAt: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  profileImage: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  phoneNumber: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
  })
  emailVerified: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  twoFactorEnabled: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  resetPasswordToken: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  resetPasswordTokenExpires: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
