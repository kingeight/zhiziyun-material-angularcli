import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdclickSegmentInfoComponent } from './adclick-segment-info.component';

describe('AdclickSegmentInfoComponent', () => {
  let component: AdclickSegmentInfoComponent;
  let fixture: ComponentFixture<AdclickSegmentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdclickSegmentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdclickSegmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
