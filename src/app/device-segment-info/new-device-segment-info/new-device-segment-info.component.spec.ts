import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeviceSegmentInfoComponent } from './new-device-segment-info.component';

describe('NewDeviceSegmentInfoComponent', () => {
  let component: NewDeviceSegmentInfoComponent;
  let fixture: ComponentFixture<NewDeviceSegmentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDeviceSegmentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDeviceSegmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
