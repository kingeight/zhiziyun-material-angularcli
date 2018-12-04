import { TestBed, inject } from '@angular/core/testing';

import { LoadingScreenService } from './loading-screen.service';

describe('LoadingScreenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingScreenService]
    });
  });

  it('should be created', inject([LoadingScreenService], (service: LoadingScreenService) => {
    expect(service).toBeTruthy();
  }));
});
