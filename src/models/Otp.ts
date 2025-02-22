import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class OTP {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar',
        length: 6,
    })
    code!: string;

    @Column({
        type: 'timestamp',
    })
    expiry!: Date;

    @Column({
        type: 'boolean',
        default: false,
    })
    isUsed!: boolean;

    // Many-to-One relationship with User
    @ManyToOne(() => User, (user) => user.otps)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    userId!: number; // Foreign key to User
}
