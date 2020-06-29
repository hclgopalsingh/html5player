import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowanswerComponent } from './showanswer.component';

describe('ShowanswerComponent', () => {
  let component: ShowanswerComponent;
  let fixture: ComponentFixture<ShowanswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowanswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowanswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
