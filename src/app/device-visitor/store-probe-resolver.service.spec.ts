import { TestBed, inject } from '@angular/core/testing';

import { StoreProbeResolverService } from './store-probe-resolver.service';

describe('StoreProbeResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreProbeResolverService]
    });
  });

  it('should be created', inject([StoreProbeResolverService], (service: StoreProbeResolverService) => {
    expect(service).toBeTruthy();
  }));
});
