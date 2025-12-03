import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Gender } from '@modules/student-registration/entity/student-registartion.entity';

@ObjectType()
@Entity({ name: 'healthy_baby_competition' })
export class HealthyBabyCompetition {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    full_name: string;

    @Field(() => Gender)
    @Column({
        type: 'enum',
        enum: Gender,
        enumName: 'gender_enum',
    })
    gender: Gender;

    @Field()
    @Column({ type: 'date' })
    date_of_birth: string;

    @Field(() => Float)
    @Column({ type: 'numeric', precision: 10, scale: 3 })
    weight_in_kg: number;

    @Field(() => Float)
    @Column({ type: 'numeric', precision: 10, scale: 2 })
    height_in_cm: number;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    father_name: string;

    @Field(() => Int)
    @Column({ type: 'smallint' })
    father_mobile_country_code: number;

    @Field()
    @Column({ type: 'bigint' })
    father_mobile: number;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    mother_name: string;

    @Field(() => Int)
    @Column({ type: 'smallint' })
    mother_mobile_country_code: number;

    @Field()
    @Column({ type: 'bigint' })
    mother_mobile: number;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    emergency_contact_name: string;

    @Field()
    @Column({ type: 'varchar', length: 200 })
    emergency_contact_person_relation: string;

    @Field(() => Int)
    @Column({ type: 'smallint' })
    emergency_mobile_country_code: number;

    @Field()
    @Column({ type: 'bigint' })
    emergency_mobile: number;

    @Field()
    @Column({ type: 'boolean', default: false })
    consent_form_accepted: boolean;

    @Field()
    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @Field({ nullable: true })
    @UpdateDateColumn({ type: 'timestamptz', nullable: true })
    updated_at?: Date;

    @Field({ nullable: true })
    @Column({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}
