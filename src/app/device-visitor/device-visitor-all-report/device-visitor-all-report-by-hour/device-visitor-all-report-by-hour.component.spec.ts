import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorAllReportByHourComponent } from './device-visitor-all-report-by-hour.component';

describe('DeviceVisitorAllReportByHourComponent', () => {
  let component: DeviceVisitorAllReportByHourComponent;
  let fixture: ComponentFixture<DeviceVisitorAllReportByHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorAllReportByHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorAllReportByHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
