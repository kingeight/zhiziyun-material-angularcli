import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceVisitorComponent } from './device-visitor.component';

describe('DeviceVisitorComponent', () => {
  let component: DeviceVisitorComponent;
  let fixture: ComponentFixture<DeviceVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
