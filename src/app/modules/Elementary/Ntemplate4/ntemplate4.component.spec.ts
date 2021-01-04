import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate4Component } from './ntemplate4.component';

describe('NTemplate4Component', () => {
  let component: NTemplate4Component;
  let fixture: ComponentFixture<NTemplate4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
