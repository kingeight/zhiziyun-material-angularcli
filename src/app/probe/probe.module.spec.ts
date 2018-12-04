import { ProbeModule } from './probe.module';

describe('ProbeModule', () => {
  let probeModule: ProbeModule;

  beforeEach(() => {
    probeModule = new ProbeModule();
  });

  it('should create an instance', () => {
    expect(probeModule).toBeTruthy();
  });
});
