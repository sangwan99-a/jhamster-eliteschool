import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IStudent } from '../student.model';
import { StudentService } from '../service/student.service';

@Component({
  standalone: true,
  templateUrl: './student-delete-dialog.component.html',
  imports: [SharedModule],
})
export class StudentDeleteDialogComponent {
  student?: IStudent;

  protected studentService = inject(StudentService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.studentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
