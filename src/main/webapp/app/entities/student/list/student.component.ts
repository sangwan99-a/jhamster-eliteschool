import { Component, inject, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormsModule } from '@angular/forms';
import { IStudent } from '../student.model';

import { StudentService } from '../service/student.service';
import { StudentDeleteDialogComponent } from '../delete/student-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-student',
  templateUrl: './student.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
  ],
})
export class StudentComponent implements OnInit {
  students?: IStudent[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = 20;
  totalItems = 0;
  page = 1;

  private studentService = inject(StudentService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.load();
  }

  trackId = (_index: number, item: IStudent): number => this.studentService.getStudentIdentifier(item);

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: HttpHeaders) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<HttpHeaders> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get('page');
    this.page = page !== null ? +page : 1;
    const sort = (params.get('sort') ?? data['defaultSort']).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === 'asc';
  }

  protected onResponseSuccess(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<HttpHeaders> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.studentService.query(queryObject).pipe(
      tap(res => (this.students = res.body ?? [])),
      tap(() => (this.isLoading = false)),
      filter(res => !!res.body),
      switchMap(res =>
        of(
          res.headers.keys().reduce((acc, cur) => {
            acc[cur] = res.headers.get(cur);
            return acc;
          }, {} as HttpHeaders)
        )
      )
    );
  }

  protected handleNavigation(page = this.page, predicate = this.predicate, ascending = this.ascending): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: `${predicate},${ascending ? 'asc' : 'desc'}`,
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? 'asc' : 'desc';
    if (predicate === '') {
      return [];
    } else {
      return [`${predicate},${ascendingQueryParam}`];
    }
  }

  delete(student: IStudent): void {
    const modalRef = this.modalService.open(StudentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.student = student;
    modalRef.closed.pipe(filter(reason => reason === 'deleted')).subscribe(() => {
      this.load();
    });
  }
}
