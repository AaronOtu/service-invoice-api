import { Test, TestingModule } from '@nestjs/testing';
import { MaterialRequestController } from './material-request.controller';
import { MaterialRequestService } from './material-request.service';

describe('MaterialRequestController', () => {
  let controller: MaterialRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialRequestController],
      providers: [MaterialRequestService],
    }).compile();

    controller = module.get<MaterialRequestController>(MaterialRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
