import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate2Component } from './ntemplate2.component';

describe('NTemplate2Component', () => {
  let component: NTemplate2Component;
  let fixture: ComponentFixture<NTemplate2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
