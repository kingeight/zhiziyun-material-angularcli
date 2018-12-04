import { DeviceVisitorModule } from './device-visitor.module';

describe('DeviceVisitorModule', () => {
  let deviceVisitorModule: DeviceVisitorModule;

  beforeEach(() => {
    deviceVisitorModule = new DeviceVisitorModule();
  });

  it('should create an instance', () => {
    expect(deviceVisitorModule).toBeTruthy();
  });
});
