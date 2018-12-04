import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorAttributeComponent } from './device-visitor-attribute.component';

describe('DeviceVisitorAttributeComponent', () => {
  let component: DeviceVisitorAttributeComponent;
  let fixture: ComponentFixture<DeviceVisitorAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorAttributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
