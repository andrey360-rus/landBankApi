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
import { GetFavoritiesAnnouncementsDto } from "./dto/get-favorities-announcements.dto";
import { UsersService } from "../users/users.service";
import { AddToFavoritiesDto } from "./dto/add-to-favorities.dto";
import { User } from "../users/entities/users.entity";
import { Request } from "express";
import { GetCoordsByAddressService } from "src/utils/get-coords-by-address/get-coords-by-address.service";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly datesService: DatesService,
    private readonly userService: UsersService,
    private readonly getCoordsByAddressService: GetCoordsByAddressService
  ) {}

  async create(data: Array<CreateAnnouncementDto>) {
    return await this.connection.manager.save(Announcement, data);
  }

  async createOne(req: Request) {
    const {
      area,
      description,
      is_rent,
      land_category,
      land_use,
      price,
      title,
      address,
      userId,
    } = req.body;

    const encodeAddress = encodeURIComponent(address);

    const { lat, lon } = await this.getCoordsByAddressService.getCoords(
      encodeAddress
    );

    const files: any = req.files;

    const photos = files.map((file) => file.filename);

    const date_published = this.datesService.formateDate(new Date());

    const announcementOptions = {
      description,
      is_rent,
      land_category,
      land_use,
      price,
      title,
      area,
      photos,
      address,
      land_class: null,
      land_plot_title: null,
      railway_line: null,
      asphalt_pavement: null,
      electricity: null,
      gas: null,
      water_supply: null,
      sewage: null,
      highway_proximity: null,
      flat_land_level: null,
      phone: null,
      lat,
      lon,
      date_published,
      date_updated: null,
      owner_name: null,
      cadastral_number: null,
      domain: "bank-zemel.ru",
      url: null,
      user: {
        id: Number(userId),
      },
    };

    const announcement = await this.connection.manager.save(
      Announcement,
      announcementOptions
    );

    return announcement;
  }

  async findAll(queryParams: GetAnnouncementsDto) {
    const {
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
      date_range = undefined,
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

    const offset = page * limit - limit;

    const MIN = 1;
    const MAX = 100_000_000_000;

    const priceFrom = price_from ? price_from : MIN;
    const priceTo = price_to ? price_to : MAX;

    let areaFrom: number;
    let areaTo: number;

    switch (areaUnit) {
      case "hectares":
        areaFrom = area_from ? area_from * 10_000 : MIN;
        areaTo = area_to ? area_to * 10_000 : MAX;
        break;

      case "acres":
        areaFrom = area_from ? area_from * 100 : MIN;
        areaTo = area_to ? area_to * 100 : MAX;
        break;

      case "sm":
        areaFrom = area_from ? area_from : MIN;
        areaTo = area_from ? area_from : MAX;
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
        keywordArr.every((keyword) =>
          announcement.description.includes(keyword.toLowerCase())
        )
      );

      totalCount = listAnnouncement.length;

      listAnnouncement = listAnnouncement.slice(offset, limit * page);
    }

    if (date_range) {
      const now = new Date();
      const dayAgo = new Date(now.setDate(now.getDate() - Number(date_range)));

      listAnnouncement = listAnnouncement.filter((announcement) => {
        if (announcement.date_published) {
          const date_published = this.datesService.parseDate(
            announcement.date_published
          );

          return date_published >= dayAgo;
        }

        return false;
      });

      totalCount = listAnnouncement.length;

      listAnnouncement = listAnnouncement.slice(offset, limit * page);
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

      case "hectares":
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

  async getFavoritiesAnnouncements(queryParams: GetFavoritiesAnnouncementsDto) {
    const { userId } = queryParams;

    const user = await this.userService.findById(userId);

    if (user) {
      return {
        listAnnouncement: user.favoritiesAnnouncements,
        totalCount: user.favoritiesAnnouncements.length,
      };
    }

    throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
  }

  async matchFavoriteAnnouncement(queryParams: AddToFavoritiesDto) {
    const { userId, announcementId } = queryParams;

    const favoritiesAnnouncements = await this.getFavoritiesAnnouncements({
      userId,
    });

    const announcement = await this.findOne(announcementId);

    if (favoritiesAnnouncements.totalCount && announcement) {
      const match = favoritiesAnnouncements.listAnnouncement.find(
        (favoriteAnnouncement) => favoriteAnnouncement.id === announcement.id
      );

      if (match) {
        return { isFavorite: true };
      }

      return { isFavorite: false };
    }

    throw new HttpException("Объявление не найдено", HttpStatus.NOT_FOUND);
  }

  async addToFavoritiesAnnouncements(data: AddToFavoritiesDto) {
    const { userId, announcementId } = data;

    const user = await this.userService.findById(userId);

    const announcement = await this.findOne(announcementId);

    if (announcement && user) {
      const newFavoritiesAnnouncements =
        user.favoritiesAnnouncements.concat(announcement);

      const userWithNewFavoriteAnnouncement = {
        ...user,
        favoritiesAnnouncements: newFavoritiesAnnouncements,
      };

      await this.connection.manager.save(User, userWithNewFavoriteAnnouncement);

      return data;
    }

    throw new HttpException(
      "Пользователь или объявление не найдены",
      HttpStatus.NOT_FOUND
    );
  }

  async removeFromFavoritiesAnnouncements(data: AddToFavoritiesDto) {
    const { userId, announcementId } = data;

    const user = await this.userService.findById(userId);

    const announcementToRemove = await this.findOne(announcementId);

    if (announcementToRemove && user) {
      const filteredAnnouncements = (user.favoritiesAnnouncements =
        user.favoritiesAnnouncements.filter(
          (announcement) => announcement.id !== announcementToRemove.id
        ));

      const userWithRemovedFavoriteAnnouncement = {
        ...user,
        announcement: filteredAnnouncements,
      };

      await this.connection.manager.save(
        User,
        userWithRemovedFavoriteAnnouncement
      );

      return data;
    }

    throw new HttpException(
      "Пользователь или объявление не найдены",
      HttpStatus.NOT_FOUND
    );
  }
}
