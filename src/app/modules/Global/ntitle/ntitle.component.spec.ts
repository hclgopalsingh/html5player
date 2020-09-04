import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtitleComponent } from './ntitle.component';

describe('NtitleComponent', () => {
  let component: NtitleComponent;
  let fixture: ComponentFixture<NtitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
