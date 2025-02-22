import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    Index,
    OneToMany,
} from 'typeorm';

import { OTP } from './Otp';

import { UserRole, AuthProvider } from '../constants/enums';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
        unique: true,
    })
    @Index()
    email: string;

    @Column({
        nullable: true,
    })
    password: string;

    @Column({
        nullable: true,
        unique: true,
    })
    @Index()
    phone: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.GUEST,
    })
    role: UserRole;

    @Column({
        type: 'enum',
        enum: AuthProvider,
        default: AuthProvider.LOCAL,
    })
    provider: AuthProvider;

    @Column({
        nullable: true,
    })
    providerId: string;

    @Column({
        default: false,
    })
    verified: boolean;

    @Column({
        nullable: true,
    })
    verificationToken: string;

    // One-to-Many relationship with OTP
    @OneToMany(() => OTP, (otp) => otp.user)
    otps!: OTP[];
}
