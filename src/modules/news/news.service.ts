import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { News } from "./entities/news.entity";
import { NewsSections } from "./news.enum";
import { deleteStaticFiles } from "src/utils/deleteStaticFiles";
import { FindAllNewsDto } from "./dto/find-all-news.dto";

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>
  ) {}

  async create(createNewsDto: CreateNewsDto, article: Express.Multer.File) {
    const newsOptions = {
      ...createNewsDto,
      article: article.filename,
    };
    const news = await this.newsRepository.save(newsOptions);

    return news;
  }

  async findAll(findAllNewsDto: FindAllNewsDto) {
    const { section } = findAllNewsDto;

    const [listNews, totalCount] = await this.newsRepository.findAndCount({
      order: { id: "DESC" },
      where: {
        ...(section && {
          section:
            NewsSections[section.toUpperCase() as keyof typeof NewsSections],
        }),
      },
    });

    return { listNews, totalCount };
  }

  async findOne(newsId: number) {
    const news = await this.newsRepository.findOne({
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
    updateNewsDto: UpdateNewsDto,
    article: Express.Multer.File
  ) {
    const news = await this.findOne(newsId);

    deleteStaticFiles("articles", news.article);

    const newsOption = {
      ...news,
      ...updateNewsDto,
      article: article.filename,
    };

    const updateNews = await this.newsRepository.save(newsOption);

    return updateNews;
  }

  async remove(newsId: number) {
    const news = await this.findOne(newsId);

    deleteStaticFiles("articles", news.article);

    await this.newsRepository.delete({ id: newsId });
    return { id: newsId };
  }
}
