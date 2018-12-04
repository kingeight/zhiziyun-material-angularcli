import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorTimeLengthComponent } from './device-visitor-time-length.component';

describe('DeviceVisitorTimeLengthComponent', () => {
  let component: DeviceVisitorTimeLengthComponent;
  let fixture: ComponentFixture<DeviceVisitorTimeLengthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorTimeLengthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorTimeLengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
