import { TestBed, inject } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
  });

  it('should be created', inject([NotificationService], (service: NotificationService) => {
    expect(service).toBeTruthy();
  }));
});
