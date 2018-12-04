import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiSegmentInfoComponent } from './wifi-segment-info.component';

describe('WifiSegmentInfoComponent', () => {
  let component: WifiSegmentInfoComponent;
  let fixture: ComponentFixture<WifiSegmentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WifiSegmentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiSegmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
