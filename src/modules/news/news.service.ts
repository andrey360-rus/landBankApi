import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { News } from "./entities/news.entity";
import { NewsSections } from "./news.enum";
import { deleteStaticFiles } from "src/utils/deleteStaticFiles";

@Injectable()
export class NewsService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection
  ) {}

  async create(newsDto: CreateNewsDto, article: Express.Multer.File) {
    const newsOptions = {
      ...newsDto,
      article: article.filename,
    };
    const news = await this.connection.manager.save(News, newsOptions);

    return news;
  }

  async findAll(section: string | undefined) {
    const [listNews, totalCount] = await this.connection.manager.findAndCount(
      News,
      {
        order: { id: "DESC" },
        where: {
          ...(section && { section: NewsSections[NewsSections[section]] }),
        },
      }
    );

    return { listNews, totalCount };
  }

  async findOne(newsId: number) {
    const news = await this.connection.manager.findOne(News, {
      where: { id: newsId },
    });

    if (!news) {
      throw new HttpException(
        "Новость с таким идентификатором не найдена",
        HttpStatus.NOT_FOUND
      );
    }

    return news;
  }

  async update(
    newsId: number,
    newsDto: UpdateNewsDto,
    article: Express.Multer.File
  ) {
    const news = await this.findOne(newsId);

    deleteStaticFiles("articles", news.article);

    const newsOption = {
      ...news,
      ...newsDto,
      article: article.filename,
    };

    const updateNews = await this.connection.manager.save(News, newsOption);

    return updateNews;
  }

  async remove(newsId: number) {
    const news = await this.findOne(newsId);

    deleteStaticFiles("articles", news.article);

    await this.connection.manager.delete(News, { id: newsId });
    return { id: newsId };
  }
}
