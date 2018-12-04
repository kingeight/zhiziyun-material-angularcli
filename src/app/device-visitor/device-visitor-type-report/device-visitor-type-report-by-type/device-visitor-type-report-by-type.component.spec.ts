import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorTypeReportByTypeComponent } from './device-visitor-type-report-by-type.component';

describe('DeviceVisitorTypeReportByTypeComponent', () => {
  let component: DeviceVisitorTypeReportByTypeComponent;
  let fixture: ComponentFixture<DeviceVisitorTypeReportByTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorTypeReportByTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorTypeReportByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
