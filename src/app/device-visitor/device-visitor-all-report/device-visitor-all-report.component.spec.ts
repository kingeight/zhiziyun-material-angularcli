import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorAllReportComponent } from './device-visitor-all-report.component';

describe('DeviceVisitorAllReportComponent', () => {
  let component: DeviceVisitorAllReportComponent;
  let fixture: ComponentFixture<DeviceVisitorAllReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorAllReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorAllReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
