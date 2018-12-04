import { TestBed, inject } from '@angular/core/testing';

import { WebSiteService } from './web-site.service';

describe('WebSiteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSiteService]
    });
  });

  it('should be created', inject([WebSiteService], (service: WebSiteService) => {
    expect(service).toBeTruthy();
  }));
});
