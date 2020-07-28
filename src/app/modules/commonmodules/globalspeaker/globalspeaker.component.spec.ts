import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalspeakerComponent } from './globalspeaker.component';

describe('GlobalspeakerComponent', () => {
  let component: GlobalspeakerComponent;
  let fixture: ComponentFixture<GlobalspeakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalspeakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalspeakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
