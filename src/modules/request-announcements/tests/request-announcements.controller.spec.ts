import { Test, TestingModule } from "@nestjs/testing";
import { RequestAnnouncementsController } from "../request-announcements.controller";
import { RequestAnnouncementsService } from "../request-announcements.service";

describe("RequestAnnouncementsController", () => {
  let controller: RequestAnnouncementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestAnnouncementsController],
      providers: [RequestAnnouncementsService],
    }).compile();

    controller = module.get<RequestAnnouncementsController>(
      RequestAnnouncementsController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
