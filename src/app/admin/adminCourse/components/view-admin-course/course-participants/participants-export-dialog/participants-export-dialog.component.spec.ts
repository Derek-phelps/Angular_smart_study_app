import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsExportDialogComponent } from './participants-export-dialog.component';

describe('ParticipantsExportDialogComponent', () => {
  let component: ParticipantsExportDialogComponent;
  let fixture: ComponentFixture<ParticipantsExportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantsExportDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsExportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
