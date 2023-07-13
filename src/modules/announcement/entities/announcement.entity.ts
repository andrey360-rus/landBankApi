import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity('announcement')
export class Announcement {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    title: string;

    @ApiProperty()
    @Column('text')
    description: string;

    @ApiProperty()
    @Column('float')
    area: number;

    @ApiProperty()
    @Column()
    address: string;

    @ApiProperty()
    @Column('float')
    price: string;

    @ApiProperty()
    @Column('text', { array: true, nullable: true})
    photos: string[];

    @ApiProperty()
    @ApiProperty()
    @Column({nullable: true})
    land_category: string;

    @ApiProperty()
    @Column({nullable: true})
    land_use: string;

    @ApiProperty()
    @Column({nullable: true})
    land_class: string;

    @ApiProperty()
    @Column({nullable: true})
    land_plot_title: string;

    @ApiProperty()
    @Column('boolean', {nullable: true})
    railway_line: string;

    @ApiProperty()
    @Column('boolean', {nullable: true})
    asphalt_pavement: string;

    @ApiProperty()
    @Column('boolean', {nullable: true})
    electricity: string;

    @ApiProperty()
    @Column('boolean', {nullable: true})
    gas: string;

    @ApiProperty()
    @Column('boolean', {nullable: true})
    water_supply: string;

    @ApiProperty()
    @Column('boolean', {nullable: true})
    sewage: string;

    @ApiProperty()
    @Column('boolean', {nullable: true})
    highway_proximity: string;

    @ApiProperty()
    @Column('boolean', {nullable: true})
    is_rent: string;

    @ApiProperty()
    @Column('boolean', {nullable: true})
    flat_land_level: string;

    @ApiProperty()
    @Column({nullable: true})
    phone: string;

    @ApiProperty()
    @Column('double precision')
    lat: number;

    @ApiProperty()
    @Column('double precision')
    lon: number;

    @ApiProperty()
    @Column({nullable: true})
    date_published: string;

    @ApiProperty()
    @Column( {nullable: true})
    date_updated: string;

    @ApiProperty()
    @Column({nullable: true})
    owner_name: string;

    @ApiProperty()
    @Column({nullable: true})
    cadastral_number: string;

    @ApiProperty()
    @Column({nullable: true})
    domain: string;

    @ApiProperty()
    @Column({nullable: true})
    url: string;
}
