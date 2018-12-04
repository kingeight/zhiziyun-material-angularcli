import { TestBed, inject } from '@angular/core/testing';

import { ProbeService } from './probe.service';

describe('ProbeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProbeService]
    });
  });

  it('should be created', inject([ProbeService], (service: ProbeService) => {
    expect(service).toBeTruthy();
  }));
});
