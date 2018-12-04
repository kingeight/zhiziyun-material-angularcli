import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorDeviceAttributeComponent } from './device-visitor-device-attribute.component';

describe('DeviceVisitorDeviceAttributeComponent', () => {
  let component: DeviceVisitorDeviceAttributeComponent;
  let fixture: ComponentFixture<DeviceVisitorDeviceAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorDeviceAttributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorDeviceAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
