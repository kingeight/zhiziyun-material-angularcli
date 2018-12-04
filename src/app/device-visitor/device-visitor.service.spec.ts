import { TestBed, inject } from '@angular/core/testing';

import { DeviceVisitorService } from './device-visitor.service';

describe('DeviceVisitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceVisitorService]
    });
  });

  it('should be created', inject([DeviceVisitorService], (service: DeviceVisitorService) => {
    expect(service).toBeTruthy();
  }));
});
