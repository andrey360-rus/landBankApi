import { Test, TestingModule } from "@nestjs/testing";
import { RequestAnnouncementsService } from "../request-announcements.service";

describe("RequestAnnouncementsService", () => {
  let service: RequestAnnouncementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestAnnouncementsService],
    }).compile();

    service = module.get<RequestAnnouncementsService>(
      RequestAnnouncementsService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
