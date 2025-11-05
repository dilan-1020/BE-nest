import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment')
    @Index({ unique: true })
    id : number;

    @Column({ type: 'varchar', length: 100 })
    name : string;

    @Column({ type: 'varchar', length: 100 })
    @Index({ unique: true })
    email : string;

    @Column({ type: 'varchar', length: 100 })
    password : string;

    @Column({ type: 'varchar', length: 20 })
    phone_number : string;

    @Column({ type: 'varchar', length: 255 })
    refresh_token : string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt : Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt : Date;

}
