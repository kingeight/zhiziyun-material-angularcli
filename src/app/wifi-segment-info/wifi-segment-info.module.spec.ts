import { WifiSegmentInfoModule } from './wifi-segment-info.module';

describe('WifiSegmentInfoModule', () => {
  let wifiSegmentInfoModule: WifiSegmentInfoModule;

  beforeEach(() => {
    wifiSegmentInfoModule = new WifiSegmentInfoModule();
  });

  it('should create an instance', () => {
    expect(wifiSegmentInfoModule).toBeTruthy();
  });
});
