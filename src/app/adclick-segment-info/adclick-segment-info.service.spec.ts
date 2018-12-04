import { TestBed, inject } from '@angular/core/testing';

import { AdclickSegmentInfoService } from './adclick-segment-info.service';

describe('AdclickSegmentInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdclickSegmentInfoService]
    });
  });

  it('should be created', inject([AdclickSegmentInfoService], (service: AdclickSegmentInfoService) => {
    expect(service).toBeTruthy();
  }));
});
