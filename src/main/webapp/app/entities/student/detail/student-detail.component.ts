import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IStudent } from '../student.model';

@Component({
  standalone: true,
  selector: 'jhi-student-detail',
  templateUrl: './student-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class StudentDetailComponent {
  @Input() student: IStudent | null = null;

  previousState(): void {
    window.history.back();
  }
}
