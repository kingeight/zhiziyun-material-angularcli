import { TestBed, inject } from '@angular/core/testing';

import { DeviceVisitorReportService } from './device-visitor-report.service';

describe('DeviceVisitorReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceVisitorReportService]
    });
  });

  it('should be created', inject([DeviceVisitorReportService], (service: DeviceVisitorReportService) => {
    expect(service).toBeTruthy();
  }));
});
