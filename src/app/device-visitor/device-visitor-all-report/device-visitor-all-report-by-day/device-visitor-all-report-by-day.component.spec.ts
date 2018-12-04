import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorAllReportByDayComponent } from './device-visitor-all-report-by-day.component';

describe('DeviceVisitorAllReportByDayComponent', () => {
  let component: DeviceVisitorAllReportByDayComponent;
  let fixture: ComponentFixture<DeviceVisitorAllReportByDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorAllReportByDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorAllReportByDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
