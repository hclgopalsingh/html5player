import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalpeakerComponent } from './Globalpeaker.component';

describe('GlobalpeakerComponent', () => {
  let component: GlobalpeakerComponent;
  let fixture: ComponentFixture<GlobalpeakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalpeakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalpeakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
