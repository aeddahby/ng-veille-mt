import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ITicket, Ticket } from '../ticket.model';
import { TicketService } from '../service/ticket.service';
import { IDirectionRegionale } from 'app/entities/direction-regionale/direction-regionale.model';
import { DirectionRegionaleService } from 'app/entities/direction-regionale/service/direction-regionale.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IEntityM } from 'app/entities/entity-m/entity-m.model';
import { EntityMService } from 'app/entities/entity-m/service/entity-m.service';
import { StateTicket } from 'app/entities/enumerations/state-ticket.model';
import { Status } from 'app/entities/enumerations/status.model';
import { AttachmentService } from 'app/entities/attachment/service/attachment.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

@Component({
  selector: 'jhi-ticket-update',
  templateUrl: './ticket-update.component.html',
})
export class TicketUpdateComponent implements OnInit {
  isSaving = false;
  stateTicketValues = Object.keys(StateTicket);
  statusValues = Object.keys(Status);
  showContributor = true;
  showDirection = true;
  showEntity = true;
  directionRegionalesCollection: IDirectionRegionale[] = [];
  categoriesCollection: ICategory[] = [];
  entitiesCollection: IEntityM[] = [];
  editForm = this.fb.group({
    id: [],
    object: [],
    description: [],
    creationDate: [],
    modificationDate: [],
    closedDate: [],
    contributor: [],
    contributorVisibility: [],
    entityVisibility: [],
    directionVisibility: [],
    centralAnimator: [],
    centralRelay: [],
    regionalRelay: [],
    stateTicket: [],
    statusTicket: [],
    pertinence: [],
    directionRegionale: [],
    category: [],
    entity: [],
    attachContentType: [],
    attach: [],  
    showContributor: [],
    showDirection: [],
    showEntity: [],
  });

  constructor(
    protected ticketService: TicketService,
    protected directionRegionaleService: DirectionRegionaleService,
    protected categoryService: CategoryService,
    protected entityMService: EntityMService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected attachmentService: AttachmentService,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticket }) => {
      if (ticket.id === undefined) {
        const today = dayjs().startOf('day');
        ticket.creationDate = today;
        ticket.modificationDate = today;
        ticket.closedDate = today;
      }

      this.updateForm(ticket);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('ngVeilleMtApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticket = this.createFromForm();
    if (ticket.id !== undefined) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
    }
  }

  trackDirectionRegionaleById(_index: number, item: IDirectionRegionale): number {
    return item.id!;
  }

  trackCategoryById(_index: number, item: ICategory): number {
    return item.id!;
  }

  trackEntityMById(_index: number, item: IEntityM): number {
    return item.id!;
  }

  showHideContributor(): void {
    this.showContributor = !this.showContributor;
    
  }

  showHideDirection(): void {
    this.showDirection = !this.showDirection;
    
  }

  showHideEntity(): void {
    this.showEntity = !this.showEntity;
    
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
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

  protected updateForm(ticket: ITicket): void {
    this.editForm.patchValue({
      id: ticket.id,
      object: ticket.object,
      description: ticket.description,
      creationDate: ticket.creationDate ? ticket.creationDate.format(DATE_TIME_FORMAT) : null,
      modificationDate: ticket.modificationDate ? ticket.modificationDate.format(DATE_TIME_FORMAT) : null,
      closedDate: ticket.closedDate ? ticket.closedDate.format(DATE_TIME_FORMAT) : null,
      contributor: ticket.contributor,
      contributorVisibility: ticket.contributorVisibility,
      entityVisibility: ticket.entityVisibility,
      directionVisibility: ticket.directionVisibility,
      centralAnimator: ticket.centralAnimator,
      centralRelay: ticket.centralRelay,
      regionalRelay: ticket.regionalRelay,
      stateTicket: ticket.stateTicket,
      statusTicket: ticket.statusTicket,
      pertinence: ticket.pertinence,
      directionRegionale: ticket.directionRegionale,
      category: ticket.category,
      entity: ticket.entity,
      attachContentType: ticket.attachContentType,
      attach: ticket.attach,    
      showContributor: ticket.contributorVisibility,
      showDirection : ticket.directionVisibility,
      showEntity : ticket.entityVisibility,
    });

    this.directionRegionalesCollection = this.directionRegionaleService.addDirectionRegionaleToCollectionIfMissing(
      this.directionRegionalesCollection,
      ticket.directionRegionale
    );
    this.categoriesCollection = this.categoryService.addCategoryToCollectionIfMissing(this.categoriesCollection, ticket.category);
    this.entitiesCollection = this.entityMService.addEntityMToCollectionIfMissing(this.entitiesCollection, ticket.entity);
  }

  protected loadRelationshipsOptions(): void {
    this.directionRegionaleService
      .query({ filter: 'ticket-is-null' })
      .pipe(map((res: HttpResponse<IDirectionRegionale[]>) => res.body ?? []))
      .pipe(
        map((directionRegionales: IDirectionRegionale[]) =>
          this.directionRegionaleService.addDirectionRegionaleToCollectionIfMissing(
            directionRegionales,
            this.editForm.get('directionRegionale')!.value
          )
        )
      )
      .subscribe((directionRegionales: IDirectionRegionale[]) => (this.directionRegionalesCollection = directionRegionales));

    this.categoryService
      .query({ filter: 'ticket-is-null' })
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('category')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesCollection = categories));

    this.entityMService
      .query({ filter: 'ticket-is-null' })
      .pipe(map((res: HttpResponse<IEntityM[]>) => res.body ?? []))
      .pipe(
        map((entityMS: IEntityM[]) => this.entityMService.addEntityMToCollectionIfMissing(entityMS, this.editForm.get('entity')!.value))
      )
      .subscribe((entityMS: IEntityM[]) => (this.entitiesCollection = entityMS));
  }

  protected createFromForm(): ITicket {
    return {
      ...new Ticket(),
      id: this.editForm.get(['id'])!.value,
      object: this.editForm.get(['object'])!.value,
      description: this.editForm.get(['description'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value
        ? dayjs(this.editForm.get(['creationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      modificationDate: this.editForm.get(['modificationDate'])!.value
        ? dayjs(this.editForm.get(['modificationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      closedDate: this.editForm.get(['closedDate'])!.value ? dayjs(this.editForm.get(['closedDate'])!.value, DATE_TIME_FORMAT) : undefined,
      contributor: this.editForm.get(['contributor'])!.value,
      contributorVisibility: this.editForm.get(['showContributor'])!.value,
      entityVisibility: this.editForm.get(['showEntity'])!.value,
      directionVisibility: this.editForm.get(['showDirection'])!.value,
      centralAnimator: this.editForm.get(['centralAnimator'])!.value,
      centralRelay: this.editForm.get(['centralRelay'])!.value,
      regionalRelay: this.editForm.get(['regionalRelay'])!.value,
      stateTicket: this.editForm.get(['stateTicket'])!.value,
      statusTicket: this.editForm.get(['statusTicket'])!.value,
      pertinence: this.editForm.get(['pertinence'])!.value,
      directionRegionale: this.editForm.get(['directionRegionale'])!.value,
      category: this.editForm.get(['category'])!.value,
      entity: this.editForm.get(['entity'])!.value,
      attachContentType: this.editForm.get(['attachContentType'])!.value,
      attach: this.editForm.get(['attach'])!.value,
    
      
    };
  }

}
