import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSegmentInfoComponent } from './device-segment-info.component';

describe('DeviceSegmentInfoComponent', () => {
  let component: DeviceSegmentInfoComponent;
  let fixture: ComponentFixture<DeviceSegmentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSegmentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSegmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
