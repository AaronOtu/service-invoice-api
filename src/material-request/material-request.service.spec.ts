import { Test, TestingModule } from '@nestjs/testing';
import { MaterialRequestService } from './material-request.service';

describe('MaterialRequestService', () => {
  let service: MaterialRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialRequestService],
    }).compile();

    service = module.get<MaterialRequestService>(MaterialRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
