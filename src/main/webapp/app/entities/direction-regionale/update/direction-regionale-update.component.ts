import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDirectionRegionale, DirectionRegionale } from '../direction-regionale.model';
import { DirectionRegionaleService } from '../service/direction-regionale.service';

@Component({
  selector: 'jhi-direction-regionale-update',
  templateUrl: './direction-regionale-update.component.html',
})
export class DirectionRegionaleUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(
    protected directionRegionaleService: DirectionRegionaleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ directionRegionale }) => {
      this.updateForm(directionRegionale);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const directionRegionale = this.createFromForm();
    if (directionRegionale.id !== undefined) {
      this.subscribeToSaveResponse(this.directionRegionaleService.update(directionRegionale));
    } else {
      this.subscribeToSaveResponse(this.directionRegionaleService.create(directionRegionale));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDirectionRegionale>>): void {
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

  protected updateForm(directionRegionale: IDirectionRegionale): void {
    this.editForm.patchValue({
      id: directionRegionale.id,
      name: directionRegionale.name,
    });
  }

  protected createFromForm(): IDirectionRegionale {
    return {
      ...new DirectionRegionale(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
