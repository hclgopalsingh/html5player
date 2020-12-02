import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactivityTimerComponent } from './inactivity-timer.component';

describe('InactivityTimerComponent', () => {
  let component: InactivityTimerComponent;
  let fixture: ComponentFixture<InactivityTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactivityTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactivityTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
