import { AdclickSegmentInfoModule } from './adclick-segment-info.module';

describe('AdclickSegmentInfoModule', () => {
  let adclickSegmentInfoModule: AdclickSegmentInfoModule;

  beforeEach(() => {
    adclickSegmentInfoModule = new AdclickSegmentInfoModule();
  });

  it('should create an instance', () => {
    expect(adclickSegmentInfoModule).toBeTruthy();
  });
});
