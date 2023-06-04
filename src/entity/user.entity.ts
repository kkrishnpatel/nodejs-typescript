import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

export enum RoleEnumType {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Index('email_index')
    @Column({
        unique: true
    })
    email: string;
    
    @Column({select: false})
    password: string;

     @Column({
    type: 'enum',
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role: RoleEnumType.USER;
}
