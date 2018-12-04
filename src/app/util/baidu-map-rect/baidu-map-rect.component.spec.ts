import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaiduMapRectComponent } from './baidu-map-rect.component';

describe('BaiduMapRectComponent', () => {
  let component: BaiduMapRectComponent;
  let fixture: ComponentFixture<BaiduMapRectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaiduMapRectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaiduMapRectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
