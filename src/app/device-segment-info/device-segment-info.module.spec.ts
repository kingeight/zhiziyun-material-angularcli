import { DeviceSegmentInfoModule } from './device-segment-info.module';

describe('DeviceSegmentInfoModule', () => {
  let deviceSegmentInfoModule: DeviceSegmentInfoModule;

  beforeEach(() => {
    deviceSegmentInfoModule = new DeviceSegmentInfoModule();
  });

  it('should create an instance', () => {
    expect(deviceSegmentInfoModule).toBeTruthy();
  });
});
