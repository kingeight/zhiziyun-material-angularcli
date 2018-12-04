import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeviceSegmentInfoComponent } from './view-device-segment-info.component';

describe('ViewDeviceSegmentInfoComponent', () => {
  let component: ViewDeviceSegmentInfoComponent;
  let fixture: ComponentFixture<ViewDeviceSegmentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDeviceSegmentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDeviceSegmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
