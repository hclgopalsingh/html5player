import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate7Component } from './ntemplate7.component';

describe('NTemplate7Component', () => {
  let component: NTemplate7Component;
  let fixture: ComponentFixture<NTemplate7Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate7Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
