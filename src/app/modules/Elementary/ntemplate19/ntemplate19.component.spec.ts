import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate19Component } from './ntemplate19.component';

describe('Ntemplate19Component', () => {
  let component: Ntemplate19Component;
  let fixture: ComponentFixture<Ntemplate19Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate19Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate19Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
