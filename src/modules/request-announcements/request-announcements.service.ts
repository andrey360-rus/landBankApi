import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateRequestAnnouncementDto } from "./dto/create-request-announcement.dto";
import { UpdateRequestAnnouncementDto } from "./dto/update-request-announcement.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RequestAnnouncement } from "./entities/request-announcement.entity";
import { GetRequestAnnouncementDto } from "./dto/get-request-announcement.dto";

@Injectable()
export class RequestAnnouncementsService {
  constructor(
    @InjectRepository(RequestAnnouncement)
    private announcementsRequestRepository: Repository<RequestAnnouncement>
  ) {}

  async create(createRequestAnnouncementDto: CreateRequestAnnouncementDto) {
    const { userId, irrigation, survey } = createRequestAnnouncementDto;

    const announcementRequestOptions = {
      ...createRequestAnnouncementDto,
      user: {
        id: userId,
      },
      irrigation: irrigation === "" ? null : irrigation === "true",
      survey: survey === "" ? null : survey === "true",
    };

    const announcement = await this.announcementsRequestRepository.save(
      announcementRequestOptions
    );

    return announcement;
  }

  async findAll(queryParams: GetRequestAnnouncementDto) {
    const { userId, limit, page } = queryParams;

    const offset = page * limit - limit;

    const [listRequestAnnouncement, totalCount] =
      await this.announcementsRequestRepository.findAndCount({
        relations: ["user"],
        order: {
          id: "DESC",
        },
        where: {
          ...(userId && {
            user: { id: userId },
          }),
        },
        skip: offset,
        take: limit,
      });

    return { listRequestAnnouncement, totalCount };
  }

  async findOne(id: number) {
    const announcement =
      await this.announcementsRequestRepository.findOneOrFail({
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

  async update(
    id: number,
    updateRequestAnnouncementDto: UpdateRequestAnnouncementDto
  ) {
    const { irrigation, survey } = updateRequestAnnouncementDto;

    const announcementRequestOptions = {
      ...updateRequestAnnouncementDto,
      irrigation: irrigation === "" ? null : irrigation === "true",
      survey: survey === "" ? null : survey === "true",
    };

    const announcement = await this.announcementsRequestRepository.update(
      id,
      announcementRequestOptions
    );

    return announcement;
  }

  async remove(id: number) {
    const announcement = await this.findOne(id);

    await this.announcementsRequestRepository.delete({ id });

    return announcement;
  }
}
