import {ApiProperty} from "@nestjs/swagger";

export class CreateAnnouncementDtoArray {
    CreateAnnouncementDto
}

export class CreateAnnouncementDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    area: number;

    @ApiProperty()
    address: string;

    @ApiProperty()
    price: string;

    @ApiProperty()
    photos: string[];

    @ApiProperty()
    land_category: string;

    @ApiProperty()
    land_use: string;

    @ApiProperty()
    land_class: string;

    @ApiProperty()
    land_plot_title: string;

    @ApiProperty()
    railway_line: string;

    @ApiProperty()
    asphalt_pavement: string;

    @ApiProperty()
    electricity: string;

    @ApiProperty()
    gas: string;

    @ApiProperty()
    water_supply: string;

    @ApiProperty()
    sewage: string;

    @ApiProperty()
    highway_proximity: string;

    @ApiProperty()
    is_rent: string;

    @ApiProperty()

    flat_land_level: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    lat: number;

    @ApiProperty()
    lon: number;

    @ApiProperty()
    date_published: Date;

    @ApiProperty()
    date_updated: Date;

    @ApiProperty()
    owner_name: string;

    @ApiProperty()
    cadastral_number: string;

    @ApiProperty()
    domain: string;

    @ApiProperty()
    url: string;
}
