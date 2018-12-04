import { TestBed, inject } from '@angular/core/testing';

import { DeviceSegmentInfoService } from './device-segment-info.service';

describe('DeviceSegmentInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceSegmentInfoService]
    });
  });

  it('should be created', inject([DeviceSegmentInfoService], (service: DeviceSegmentInfoService) => {
    expect(service).toBeTruthy();
  }));
});
