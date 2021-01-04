import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate13Component } from './ntemplate13.component';

describe('NTemplate13Component', () => {
  let component: NTemplate13Component;
  let fixture: ComponentFixture<NTemplate13Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate13Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
