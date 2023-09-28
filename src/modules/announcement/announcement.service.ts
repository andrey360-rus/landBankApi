/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { InjectConnection } from "@nestjs/typeorm";
import { Between, ILike, In, LessThan, MoreThan, Raw } from "typeorm";
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
import { deleteStaticFiles } from "src/utils/deleteStaticFiles";
import { myAnnouncementDomain } from "src/modules/announcement/announcement.consts";

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
    try {
      await this.connection.manager.save(Announcement, data);
      return { message: "Announcement added" };
    } catch (error) {
      throw new NotFoundException("Ошибка при добавлении объявлений");
    }
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      area: area * 10_000,
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
      domain: myAnnouncementDomain,
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
    const newAddressArr = addressArr.map((address) => address.split(" "));
    const flattenedAddresses = Array.prototype.concat.apply([], newAddressArr);

    const sortingElement = JSON.parse(sorting);

    let offset: number | undefined;

    if (limit) {
      offset = page * limit - limit;
    }

    // let dayAgo: string;

    // if (date_range) {
    //   dayAgo = new Date(
    //     new Date().setDate(new Date().getDate() - Number(date_range))
    //   )
    //     .toISOString()
    //     .slice(0, 19)
    //     .replace("T", " ");
    // }
    // console.log(new Date().toISOString().slice(0, 19).replace("T", " "));

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
          // ...(domain && {
          //   domain: Raw((alias) => `${alias} IN (:...domainArr)`, {
          //     domainArr: domainArray,
          //   }),
          // }),
          ...(land_use && { land_use: In(landUseArr) }),
          ...(land_category && { land_category: In(landCategoryArr) }),
          ...(address && {
            address: Raw(
              (alias) => `string_to_array(${alias}, ' ') && :addresses`,
              {
                addresses: flattenedAddresses,
              }
            ),
          }),

          ...(keyword && {
            description: ILike(`%${decodeURIComponent(keyword)}%`),
          }),
          // строковый тип поля не преобразуется при DATE()
          // ...(date_range && {
          //   date_published: Raw((alias) => `DATE(${alias}) < ${dayAgo}`),
          // }),
          // ...(date_range && {
          //   date_published: LessThan(dayAgo),
          // }),
        },
        ...(limit && {
          skip: offset,
          take: limit,
        }),
      });

    if (date_range) {
      const limit = 100,
        page = 1,
        offset = page * limit - limit;

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

  // метод вроде обрабатывает и свои объявления, и из парсера
  async update(
    id: number,
    updateAnnouncementDto: UpdateAnnouncementDto,
    isRemoveInitImages: string,
    req: Request
  ) {
    const nowDate = this.datesService.formateDate(new Date());

    const announcement = await this.connection.manager.findOne(Announcement, {
      where: { id },
      relations: ["user"],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const files: any = req.files;

    const newPhotos = files.map((file) => file.filename);

    const { area, removableFiles, address } = updateAnnouncementDto;

    let coords: { lat: number; lon: number };
    if (address) {
      coords = await this.getCoordsByAddressService.getCoords(address);
    }

    let removableFilesArr: string[] | string = removableFiles;

    if (typeof removableFiles === "string") {
      removableFilesArr = [removableFiles];
    }

    const newArea = area * 10_000;

    let newAnnouncementPhotos: string[];

    if (isRemoveInitImages === "true") {
      if (announcement.domain === myAnnouncementDomain) {
        if (announcement.photos.length) {
          announcement.photos.forEach((photo) => deleteStaticFiles(photo));
        }
      }

      newAnnouncementPhotos = newPhotos;
    } else {
      if (removableFilesArr && removableFilesArr.length) {
        removableFilesArr.forEach((photo) => {
          if (announcement.photos.includes(photo)) {
            deleteStaticFiles(photo);

            const index = announcement.photos.indexOf(photo);

            if (index !== -1) {
              announcement.photos.splice(index, 1);
            }
          }
        });
      }

      newAnnouncementPhotos = announcement.photos.concat(newPhotos);
    }

    const announcementOptions = {
      ...announcement,
      ...updateAnnouncementDto,
      area: newArea,
      date_updated: nowDate,
      photos: newAnnouncementPhotos,
      ...(coords && { lat: coords.lat, lon: coords.lon }),
    };

    const editAnnouncement = await this.connection.manager.save(
      Announcement,
      announcementOptions
    ); // метод update не хочет работать, выдает ошибку, что не может найти сущность userId

    return editAnnouncement;
  }

  async remove(id: number) {
    const announcement = await this.connection.manager.findOne(Announcement, {
      where: { id },
    });

    if (announcement.domain === myAnnouncementDomain) {
      if (announcement.photos.length) {
        announcement.photos.forEach((photo) => deleteStaticFiles(photo));
      }
    }

    await this.connection.manager.delete(Announcement, { id });

    return announcement;
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

    if (announcement) {
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
