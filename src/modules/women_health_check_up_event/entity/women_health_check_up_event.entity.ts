import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@ObjectType()
@Entity('women_health_checkup_event')
export class WomenHealthCheckupEvent {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  spouse_name: string;

  @Field()
  @Column({ type: 'smallint' })
  country_code: number;

  @Field()
  @Column({ type: 'bigint' })
  mobile: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Field({ nullable: true })
  @Column({ type: 'int' })
  donation_amount: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updated_at: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date;
}
