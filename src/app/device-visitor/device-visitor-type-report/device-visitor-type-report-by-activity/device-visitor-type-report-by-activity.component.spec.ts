import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorTypeReportByActivityComponent } from './device-visitor-type-report-by-activity.component';

describe('DeviceVisitorTypeReportByActivityComponent', () => {
  let component: DeviceVisitorTypeReportByActivityComponent;
  let fixture: ComponentFixture<DeviceVisitorTypeReportByActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorTypeReportByActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorTypeReportByActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
