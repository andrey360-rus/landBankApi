import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, ILike, In, MoreThanOrEqual, Repository } from "typeorm";
import { Announcement } from "./entities/announcement.entity";
import { GetAnnouncementsDto } from "./dto/get-announcements.dto";
import { ToggleCheckedAnnouncementDto } from "./dto/toggle-checked-announcement.dto";
import { DatesService } from "src/utils/dates/dates.service";
import { GetFavoritiesAnnouncementsDto } from "./dto/get-favorities-announcements.dto";
import { UsersService } from "../users/users.service";
import { AddToFavoritiesDto } from "./dto/add-to-favorities.dto";
import { User } from "../users/entities/users.entity";
import { deleteStaticFiles } from "src/utils/deleteStaticFiles";
import { myAnnouncementDomain } from "src/modules/announcement/announcement.consts";
import { CreateOneAnnouncementDto } from "./dto/create-one-announcement.dto";
import { ICoords } from "./interfaces/announcement.interface";
import {
  AnnouncementShowMethodEnum,
  AnnouncementStatusesEnum,
  AreaUnitEnum,
} from "./announcement.enum";
import { SetStatusAnnouncementDto } from "./dto/set-status-announcement.dto";

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly datesService: DatesService,
    private readonly userService: UsersService
  ) {}

  async create_v2(data: Array<CreateAnnouncementDto>) {
    try {
      this.dateGeneration(data);
      await this.announcementsRepository.save(data);
      return { message: "Объявления успешно добавлены" };
    } catch (error) {
      throw new BadRequestException("Ошибка при добавлении объявлений");
    }
  }

  async create(data: Array<CreateAnnouncementDto>) {
    const limit = await this.checkBalanceRequestApiDaData();

    if (data.length > limit) {
      throw new HttpException(
        `Единожды можно добавить не больше ${limit} объявлений`,
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      this.dateGeneration(data);
      const formationData = await this.regionKladrIdGeneration(data);

      await this.announcementsRepository.save(formationData);
      return { message: "Объявления успешно добавлены" };
    } catch (error) {
      throw new BadRequestException("Ошибка при добавлении объявлений");
    }
  }

  async createOne(
    files: Express.Multer.File[],
    createAnnouncementDto: CreateOneAnnouncementDto
  ) {
    const {
      area,
      description,
      is_rent,
      land_category,
      land_use,
      price,
      title,
      address,
      region_kladr_id,
      geo_lat,
      geo_lon,
      userId,
      rentPeriod,
      type_of_use,
      irrigation,
      survey,
      cultivated_crop,
    } = createAnnouncementDto;

    const limit = await this.checkBalanceRequestApiDaData();

    if (limit === 0) {
      throw new HttpException(
        "Превышена квота запросов, попробуйте позже!",
        HttpStatus.BAD_REQUEST
      );
    }

    const photos = files.map((file) => file.filename);

    const date_published = new Date().toISOString();

    let dateRentPeriod: Date | undefined;
    if (rentPeriod) {
      dateRentPeriod = this.datesService.parseDate(rentPeriod);
    }

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
      lat: geo_lat,
      lon: geo_lon,
      date_published,
      date_updated: null,
      owner_name: null,
      cadastral_number: null,
      domain: myAnnouncementDomain,
      url: null,
      region_kladr_id,
      is_checked: false,
      type_of_use,
      cultivated_crop,
      irrigation: irrigation === "false" ? false : true,
      survey: survey === "false" ? false : true,
      rent_period: rentPeriod ? dateRentPeriod : null,
      status: AnnouncementStatusesEnum.AWAIT,
      user: {
        id: +userId,
      },
    };

    const announcement = await this.announcementsRepository.save(
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
      areaUnit = AreaUnitEnum.HECTARES,
      is_rent = false,
      keyword,
      date_range = undefined,
      land_use,
      land_category,
      sorting,
      provideTag = AnnouncementShowMethodEnum.LIST,
      userId,
      geoBounds,
      status = AnnouncementStatusesEnum.ACTIVE,
    } = queryParams;

    const isMapMethod = provideTag === AnnouncementShowMethodEnum.MAP;

    const domainArray = decodeURIComponent(domain).split(",") || undefined;

    const landCategoryArr =
      decodeURIComponent(land_category).split(",") || undefined;

    const landUseArr = decodeURIComponent(land_use).split(",") || undefined;

    const addressArr = decodeURIComponent(address).split(",") || undefined;

    const sortingElement = JSON.parse(sorting);

    const geoBoundsArr =
      decodeURIComponent(geoBounds)
        .split(",")
        .map((coords) => +coords) || undefined;

    let offset: number | undefined;

    let dayAgo: Date | undefined;

    const MIN = 1;
    const MAX = Infinity;

    const priceFrom = price_from ? price_from : MIN;
    const priceTo = price_to ? price_to : MAX;

    let areaFrom: number;
    let areaTo: number;

    if (limit) {
      offset = page * limit - limit;
    }

    if (date_range) {
      dayAgo = new Date(
        new Date().setDate(new Date().getDate() - Number(date_range))
      );
    }

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

    const [listAnnouncement, totalCount] =
      await this.announcementsRepository.findAndCount({
        ...(isMapMethod && {
          select: {
            id: true,
            lat: true,
            lon: true,
            area: true,
          },
        }),
        order: {
          ...sortingElement,
        },
        where: {
          status,
          price: Between(priceFrom, priceTo),
          area: Between(areaFrom, areaTo),
          is_rent,
          ...(domain && { domain: In(domainArray) }),
          ...(land_use && { land_use: In(landUseArr) }),
          ...(land_category && { land_category: In(landCategoryArr) }),
          ...(address && {
            region_kladr_id: In(addressArr),
          }),
          ...(keyword && {
            description: ILike(`%${decodeURIComponent(keyword)}%`),
          }),
          ...(date_range && {
            date_published: MoreThanOrEqual(dayAgo),
          }),
          ...(isMapMethod && {
            lat: Between(geoBoundsArr[0], geoBoundsArr[2]),
            lon: Between(geoBoundsArr[1], geoBoundsArr[3]),
          }),
          ...(userId && { user: { id: userId } }),
        },
        ...(limit && {
          skip: offset,
          take: limit,
        }),
      });

    if (!isMapMethod) {
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
            announcement.title = `Участок ${(
              announcement.area / 10_000
            ).toFixed(4)} га `;
          });
          break;
      }
    }

    return { listAnnouncement, totalCount };
  }

  async findOne(id: number) {
    const announcement = await this.announcementsRepository.findOneOrFail({
      where: { id },
      relations: ["user"],
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
    files: Express.Multer.File[]
  ) {
    const announcement = await this.findOne(id);

    const newPhotos = files.map((file) => file.filename);

    const {
      area,
      removableFiles,
      address,
      rentPeriod,
      irrigation,
      survey,
      type_of_use,
      cultivated_crop,
    } = updateAnnouncementDto;

    let dateRentPeriod: Date | undefined;

    let coords: ICoords;
    if (announcement.address !== address) {
      coords = await this.getCoordsByAddress(address);
    }

    if (rentPeriod) {
      dateRentPeriod = this.datesService.parseDate(rentPeriod);
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
          announcement.photos.forEach((photo) =>
            deleteStaticFiles("uploads", photo)
          );
        }
      }

      newAnnouncementPhotos = newPhotos;
    } else {
      if (removableFilesArr && removableFilesArr.length) {
        removableFilesArr.forEach((photo) => {
          if (announcement.photos.includes(photo)) {
            deleteStaticFiles("uploads", photo);

            const index = announcement.photos.indexOf(photo);

            if (index !== -1) {
              announcement.photos.splice(index, 1);
            }
          }
        });
      }

      newAnnouncementPhotos = announcement.photos.concat(newPhotos);
    }

    const date_updated = new Date().toISOString().slice(0, 10);

    announcement.resetChecked();

    const announcementOptions = this.announcementsRepository.create({
      ...announcement,
      ...updateAnnouncementDto,
      area: newArea,
      date_updated,
      photos: newAnnouncementPhotos,
      ...(coords && { lat: coords.lat, lon: coords.lon }),
      irrigation: irrigation === "false" ? false : true,
      survey: survey === "false" ? false : true,
      rent_period: rentPeriod ? dateRentPeriod : null,
      cultivated_crop: type_of_use === "arable" ? cultivated_crop : null,
    });

    const editAnnouncement = await this.announcementsRepository.save(
      announcementOptions
    );

    return editAnnouncement;
  }
  async remove(id: number) {
    const announcement = await this.findOne(id);

    if (announcement.domain === myAnnouncementDomain) {
      if (announcement.photos.length) {
        announcement.photos.forEach((photo) =>
          deleteStaticFiles("uploads", photo)
        );
      }
    }

    await this.announcementsRepository.delete({ id });

    return announcement;
  }

  async toggleChecked(data: ToggleCheckedAnnouncementDto) {
    const { id, isChecked } = data;

    await this.announcementsRepository.update(
      { id },
      { is_checked: isChecked }
    );
    return { id, isChecked };
  }

  async getAnnouncementsCount() {
    const count = await this.announcementsRepository.count();

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

      await this.usersRepository.save(userWithNewFavoriteAnnouncement);

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

      await this.usersRepository.save(userWithRemovedFavoriteAnnouncement);

      return data;
    }

    throw new HttpException(
      "Пользователь или объявление не найдены",
      HttpStatus.NOT_FOUND
    );
  }

  private dateGeneration(data: CreateAnnouncementDto[]) {
    data.forEach((announcement) => {
      const { date_published, date_updated } = announcement;
      if (date_published && date_updated && date_published !== "NULL") {
        const dateArr = [date_published, date_updated];

        const newDateArr = dateArr.map((date) => {
          const parseDate = this.datesService.parseDate(date);

          const generatedDate = this.datesService.formateDate(parseDate);

          return generatedDate;
        });

        announcement.date_published = newDateArr[0];
        announcement.date_updated = newDateArr[1];
      }
    });

    return data;
  }

  private async regionKladrIdGeneration(data: CreateAnnouncementDto[]) {
    for (const announcement of data) {
      const regionKladrId = await this.getRegionKladrId({
        lat: announcement.lat,
        lon: announcement.lon,
      });

      announcement.region_kladr_id = regionKladrId;
    }

    return data;
  }

  private async getRegionKladrId(announcementCoords: ICoords) {
    const url =
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
    const token = process.env.DADATA_API_KEY;
    const { lat, lon } = announcementCoords;
    const query = { lat, lon };
    const options = {
      method: "POST",
      mode: "cors" as RequestMode,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify(query),
    };

    try {
      const res = await fetch(url, options);
      const resJson = await res.json();

      if (!resJson.suggestions.length) {
        return null;
      }

      const regionKladrId: string =
        resJson.suggestions[0].data.region_kladr_id.toString();

      return regionKladrId;
    } catch (error) {
      throw new HttpException("Некорректный адрес", HttpStatus.BAD_REQUEST);
    }
  }

  private async checkBalanceRequestApiDaData() {
    const url = "https://dadata.ru/api/v2/stat/daily";
    const token = process.env.DADATA_API_KEY;
    const secret = process.env.DADATA_SECRET_KEY;

    const options = {
      method: "GET",
      mode: "cors" as RequestMode,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
        "X-Secret": secret,
      },
    };

    try {
      const res = await fetch(url, options);
      const resJson = await res.json();

      const limitSuggestions: number = resJson.remaining.suggestions;

      return limitSuggestions;
    } catch (error) {
      throw new HttpException("Произошла ошибка!", HttpStatus.BAD_REQUEST);
    }
  }

  private async getCoordsByAddress(encodeAddress: string) {
    const url = "https://cleaner.dadata.ru/api/v1/clean/address";
    const token = process.env.DADATA_API_KEY;
    const secret = process.env.DADATA_SECRET_KEY;
    const query = encodeAddress;

    const options = {
      method: "POST",
      mode: "cors" as RequestMode,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
        "X-Secret": secret,
      },
      body: JSON.stringify([query]),
    };

    try {
      const res = await fetch(url, options);
      const resJson = await res.json();

      const addressCoords: ICoords = {
        lat: resJson[0].geo_lat,
        lon: resJson[0].geo_lon,
      };

      return addressCoords;
    } catch (error) {
      throw new HttpException("Произошла ошибка!", HttpStatus.BAD_REQUEST);
    }
  }

  async setStatusAnnouncement(data: SetStatusAnnouncementDto) {
    const { id, status } = data;
    await this.announcementsRepository.update({ id }, { status });

    return { id, status };
  }
}
