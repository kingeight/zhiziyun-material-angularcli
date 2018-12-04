import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorTypeReportComponent } from './device-visitor-type-report.component';

describe('DeviceVisitorTypeReportComponent', () => {
  let component: DeviceVisitorTypeReportComponent;
  let fixture: ComponentFixture<DeviceVisitorTypeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorTypeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorTypeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
