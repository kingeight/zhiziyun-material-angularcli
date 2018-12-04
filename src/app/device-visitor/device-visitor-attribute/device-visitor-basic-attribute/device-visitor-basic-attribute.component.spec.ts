import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorBasicAttributeComponent } from './device-visitor-basic-attribute.component';

describe('DeviceVisitorBasicAttributeComponent', () => {
  let component: DeviceVisitorBasicAttributeComponent;
  let fixture: ComponentFixture<DeviceVisitorBasicAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorBasicAttributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorBasicAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
