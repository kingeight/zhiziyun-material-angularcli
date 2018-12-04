import { TestBed, inject } from '@angular/core/testing';

import { WifiSegmentInfoService } from './wifi-segment-info.service';

describe('WifiSegmentInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WifiSegmentInfoService]
    });
  });

  it('should be created', inject([WifiSegmentInfoService], (service: WifiSegmentInfoService) => {
    expect(service).toBeTruthy();
  }));
});
