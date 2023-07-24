import { Injectable } from "@nestjs/common";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { InjectConnection } from "@nestjs/typeorm";
import { Between, In } from "typeorm";
import { Connection } from "typeorm";
import { Announcement } from "./entities/announcement.entity";
import { GetAnnouncementsDto } from "./dto/get-announcements.dto";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection
  ) {}

  async create(data: Array<CreateAnnouncementDto>) {
    return await this.connection.manager.save(Announcement, data);
  }

  async findAll(queryParams: GetAnnouncementsDto) {
    let { limit, page, price_to, price_from, area_to, area_from, domain } =
      queryParams;

    let offset = page * limit - limit;

    const priceFrom = !!price_from ? price_from : 1;
    const priceTo = !!price_to ? price_to : 100000000000;
    const areaFrom = !!area_from ? area_from : 1;
    const areaTo = !!area_to ? area_to : 100000000000;
    const domainsCorrect = domain?.length
      ? [...domain]
      : ["cian.ru", "avito.ru"];

    const [listAnnouncement, totalCount] =
      await this.connection.manager.findAndCount(Announcement, {
        order: {
          id: "DESC",
        },
        where: {
          price: Between(priceFrom, priceTo),
          area: Between(areaFrom, areaTo),
          domain: In(domainsCorrect),
        },
        skip: offset,
        take: limit,
      });
    return { listAnnouncement, totalCount };
  }

  async findOne(id: number) {
    return await this.connection.manager.findOne(Announcement, {
      where: { id },
    });
  }

  update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    return `This action updates a #${id} announcement`;
  }

  remove(id: number) {
    return `This action removes a #${id} announcement`;
  }

  async getForMap() {
    try {
      const announcementPropSelect = [
        "Announcement.id",
        "Announcement.title",
        "Announcement.lat",
        "Announcement.lon",
        "Announcement.price",
        "Announcement.area",
        "Announcement.photos",
      ];

      const qb = await this.connection.manager.createQueryBuilder();

      const [listAnnouncement, totalCount] = await qb
        .select(announcementPropSelect)
        .from(Announcement, "Announcement")
        // .addSelect((subQuery) => {
        //   return subQuery
        //     .select("Announcement.photos")
        //     .from(Announcement, "Announcement")
        //     .limit(1);
        // })
        .getManyAndCount();

      return { listAnnouncement, totalCount };
    } catch (error) {
      console.log(error);
    }
  }
}
