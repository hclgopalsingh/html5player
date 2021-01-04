import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate6Component } from './ntemplate6.component';

describe('NTemplate6Component', () => {
  let component: NTemplate6Component;
  let fixture: ComponentFixture<NTemplate6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
