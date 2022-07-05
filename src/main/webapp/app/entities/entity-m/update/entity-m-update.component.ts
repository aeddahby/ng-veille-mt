import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEntityM, EntityM } from '../entity-m.model';
import { EntityMService } from '../service/entity-m.service';

@Component({
  selector: 'jhi-entity-m-update',
  templateUrl: './entity-m-update.component.html',
})
export class EntityMUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [],
  });

  constructor(protected entityMService: EntityMService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entityM }) => {
      this.updateForm(entityM);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const entityM = this.createFromForm();
    if (entityM.id !== undefined) {
      this.subscribeToSaveResponse(this.entityMService.update(entityM));
    } else {
      this.subscribeToSaveResponse(this.entityMService.create(entityM));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEntityM>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(entityM: IEntityM): void {
    this.editForm.patchValue({
      id: entityM.id,
      title: entityM.title,
    });
  }

  protected createFromForm(): IEntityM {
    return {
      ...new EntityM(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
    };
  }
}
