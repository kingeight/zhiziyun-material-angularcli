import { TestBed, inject } from '@angular/core/testing';

import { DeviceSegmentInfoResolverService } from './device-segment-info-resolver.service';

describe('DeviceSegmentInfoResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceSegmentInfoResolverService]
    });
  });

  it('should be created', inject([DeviceSegmentInfoResolverService], (service: DeviceSegmentInfoResolverService) => {
    expect(service).toBeTruthy();
  }));
});
