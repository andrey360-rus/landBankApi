import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { InjectConnection } from "@nestjs/typeorm";
import { Between, In } from "typeorm";
import { Connection } from "typeorm";
import { Announcement } from "./entities/announcement.entity";
import { GetAnnouncementsDto } from "./dto/get-announcements.dto";
import { ToggleCheckedAnnouncementDto } from "./dto/toggle-checked-announcement.dto";
import { DatesService } from "src/utils/dates/dates.service";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly datesService: DatesService
  ) {}

  async create(data: Array<CreateAnnouncementDto>) {
    return await this.connection.manager.save(Announcement, data);
  }

  async findAll(queryParams: GetAnnouncementsDto) {
    let {
      limit,
      page,
      price_to,
      price_from,
      area_to,
      area_from,
      domain,
      address,
      areaUnit = "hectares",
      is_rent = false,
      keyword,
      date_range,
      land_use,
      land_category,
      sorting,
    } = queryParams;

    const domainArray = decodeURIComponent(domain).split(",") || undefined;

    const landCategoryArr =
      decodeURIComponent(land_category).split(",") || undefined;

    const landUseArr = decodeURIComponent(land_use).split(",") || undefined;

    const addressArr = decodeURIComponent(address).split(",") || undefined;

    const keywordArr = decodeURIComponent(keyword).split(" ") || undefined;

    const sortingElement = JSON.parse(sorting);

    let offset = page * limit - limit;

    const MIN = 1;
    const MAX = 100_000_000_000;

    const priceFrom = !!price_from ? price_from : MIN;
    const priceTo = !!price_to ? price_to : MAX;

    let areaFrom: number;
    let areaTo: number;

    switch (areaUnit) {
      case "hectares":
        areaFrom = !!area_from ? area_from * 10_000 : MIN;
        areaTo = !!area_to ? area_to * 10_000 : MAX;
        break;

      case "acres":
        areaFrom = !!area_from ? area_from * 100 : MIN;
        areaTo = !!area_to ? area_to * 100 : MAX;
        break;

      case "sm":
        areaFrom = !!area_from ? area_from : MIN;
        areaTo = !!area_from ? area_from : MAX;
        break;
    }

    let [listAnnouncement, totalCount] =
      await this.connection.manager.findAndCount(Announcement, {
        order: {
          ...sortingElement,
        },
        where: {
          price: Between(priceFrom, priceTo),
          area: Between(areaFrom, areaTo),
          is_rent,
          ...(domain && { domain: In(domainArray) }),
          ...(land_use && { land_use: In(landUseArr) }),
          ...(land_category && { land_category: In(landCategoryArr) }),
        },
        ...((!address || !date_range || !keyword) && {
          skip: offset,
          take: limit,
        }),
      });

    if (address) {
      listAnnouncement = listAnnouncement.filter((announcement) =>
        addressArr.find((address) => announcement.address.includes(address))
      );

      totalCount = listAnnouncement.length;

      listAnnouncement = listAnnouncement.slice(offset, limit * page);
    }

    if (keyword) {
      listAnnouncement = listAnnouncement.filter((announcement) =>
        keywordArr.every((keyword) => {
          keyword.toLowerCase();
          return announcement.description.includes(keyword);
        })
      );

      totalCount = listAnnouncement.length;

      listAnnouncement = listAnnouncement.slice(offset, limit * page);
    }

    const now = new Date();
    let date_published: Date;

    switch (date_range) {
      case "3":
        const threeDaysAgoDate = new Date(now.setDate(now.getDate() - 3));

        listAnnouncement = listAnnouncement.filter((announcement) => {
          if (announcement.date_published) {
            date_published = this.datesService.parseDate(
              announcement.date_published
            );

            return date_published >= threeDaysAgoDate;
          }

          return false;
        });

        totalCount = listAnnouncement.length;

        listAnnouncement = listAnnouncement.slice(offset, limit * page);

        break;

      case "7":
        const sevenDaysAgoDate = new Date(now.setDate(now.getDate() - 7));

        listAnnouncement = listAnnouncement.filter((announcement) => {
          if (announcement.date_published) {
            date_published = this.datesService.parseDate(
              announcement.date_published
            );

            return date_published >= sevenDaysAgoDate;
          }

          return false;
        });

        totalCount = listAnnouncement.length;

        listAnnouncement = listAnnouncement.slice(offset, limit * page);

        break;
      case "30":
        const thirtyDaysAgoDate = new Date(now.setDate(now.getDate() - 30));

        listAnnouncement = listAnnouncement.filter((announcement) => {
          if (announcement.date_published) {
            date_published = this.datesService.parseDate(
              announcement.date_published
            );

            return date_published >= thirtyDaysAgoDate;
          }

          return false;
        });

        totalCount = listAnnouncement.length;

        listAnnouncement = listAnnouncement.slice(offset, limit * page);

        break;
    }

    switch (areaUnit) {
      case "acres":
        listAnnouncement.forEach((announcement) => {
          announcement.title = `Участок ${announcement.area / 100} сотки`;
        });
        break;

      case "sm":
        listAnnouncement.forEach((announcement) => {
          announcement.title = `Участок ${announcement.area.toFixed()} кв.м`;
        });
        break;

      default:
        listAnnouncement.forEach((announcement) => {
          announcement.title = `Участок ${(announcement.area / 10_000).toFixed(
            4
          )} га `;
        });
        break;
    }

    return { listAnnouncement, totalCount };
  }

  async findOne(id: number) {
    const announcement = await this.connection.manager.findOne(Announcement, {
      where: { id },
    });

    if (!announcement) {
      throw new HttpException(
        "Объявление с таким идентификатором не найдено",
        HttpStatus.NOT_FOUND
      );
    }

    return announcement;
  }

  update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    return `This action updates a #${id} announcement`;
  }

  remove(id: number) {
    return `This action removes a #${id} announcement`;
  }

  async getAllUniqueValuesByProp(prop: string) {
    try {
      const qb = this.connection.manager.createQueryBuilder();

      const listValue = await qb
        .select(prop)
        .from(Announcement, "Announcement")
        .distinct(true)
        .getRawMany();
      return listValue;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async toggleChecked(data: ToggleCheckedAnnouncementDto) {
    const { id, isChecked } = data;

    const announcement = await this.findOne(id);

    announcement.isChecked = isChecked;
    await this.connection.manager.save(Announcement, data);
    return { id, isChecked };
  }

  async getAnnouncementsCount() {
    const count = await this.connection.manager.count(Announcement);

    return { count };
  }
}
