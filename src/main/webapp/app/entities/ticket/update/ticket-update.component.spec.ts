import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TicketService } from '../service/ticket.service';
import { ITicket, Ticket } from '../ticket.model';
import { IDirectionRegionale } from 'app/entities/direction-regionale/direction-regionale.model';
import { DirectionRegionaleService } from 'app/entities/direction-regionale/service/direction-regionale.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IEntityM } from 'app/entities/entity-m/entity-m.model';
import { EntityMService } from 'app/entities/entity-m/service/entity-m.service';

import { TicketUpdateComponent } from './ticket-update.component';

describe('Ticket Management Update Component', () => {
  let comp: TicketUpdateComponent;
  let fixture: ComponentFixture<TicketUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ticketService: TicketService;
  let directionRegionaleService: DirectionRegionaleService;
  let categoryService: CategoryService;
  let entityMService: EntityMService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TicketUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TicketUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TicketUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ticketService = TestBed.inject(TicketService);
    directionRegionaleService = TestBed.inject(DirectionRegionaleService);
    categoryService = TestBed.inject(CategoryService);
    entityMService = TestBed.inject(EntityMService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call directionRegionale query and add missing value', () => {
      const ticket: ITicket = { id: 456 };
      const directionRegionale: IDirectionRegionale = { id: 8436 };
      ticket.directionRegionale = directionRegionale;

      const directionRegionaleCollection: IDirectionRegionale[] = [{ id: 39512 }];
      jest.spyOn(directionRegionaleService, 'query').mockReturnValue(of(new HttpResponse({ body: directionRegionaleCollection })));
      const expectedCollection: IDirectionRegionale[] = [directionRegionale, ...directionRegionaleCollection];
      jest.spyOn(directionRegionaleService, 'addDirectionRegionaleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      expect(directionRegionaleService.query).toHaveBeenCalled();
      expect(directionRegionaleService.addDirectionRegionaleToCollectionIfMissing).toHaveBeenCalledWith(
        directionRegionaleCollection,
        directionRegionale
      );
      expect(comp.directionRegionalesCollection).toEqual(expectedCollection);
    });

    it('Should call category query and add missing value', () => {
      const ticket: ITicket = { id: 456 };
      const category: ICategory = { id: 46847 };
      ticket.category = category;

      const categoryCollection: ICategory[] = [{ id: 67561 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const expectedCollection: ICategory[] = [category, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, category);
      expect(comp.categoriesCollection).toEqual(expectedCollection);
    });

    it('Should call entity query and add missing value', () => {
      const ticket: ITicket = { id: 456 };
      const entity: IEntityM = { id: 5133 };
      ticket.entity = entity;

      const entityCollection: IEntityM[] = [{ id: 78167 }];
      jest.spyOn(entityMService, 'query').mockReturnValue(of(new HttpResponse({ body: entityCollection })));
      const expectedCollection: IEntityM[] = [entity, ...entityCollection];
      jest.spyOn(entityMService, 'addEntityMToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      expect(entityMService.query).toHaveBeenCalled();
      expect(entityMService.addEntityMToCollectionIfMissing).toHaveBeenCalledWith(entityCollection, entity);
      expect(comp.entitiesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ticket: ITicket = { id: 456 };
      const directionRegionale: IDirectionRegionale = { id: 23621 };
      ticket.directionRegionale = directionRegionale;
      const category: ICategory = { id: 76096 };
      ticket.category = category;
      const entity: IEntityM = { id: 68614 };
      ticket.entity = entity;

      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ticket));
      expect(comp.directionRegionalesCollection).toContain(directionRegionale);
      expect(comp.categoriesCollection).toContain(category);
      expect(comp.entitiesCollection).toContain(entity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ticket>>();
      const ticket = { id: 123 };
      jest.spyOn(ticketService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticket }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ticketService.update).toHaveBeenCalledWith(ticket);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ticket>>();
      const ticket = new Ticket();
      jest.spyOn(ticketService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticket }));
      saveSubject.complete();

      // THEN
      expect(ticketService.create).toHaveBeenCalledWith(ticket);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ticket>>();
      const ticket = { id: 123 };
      jest.spyOn(ticketService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ticketService.update).toHaveBeenCalledWith(ticket);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDirectionRegionaleById', () => {
      it('Should return tracked DirectionRegionale primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDirectionRegionaleById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCategoryById', () => {
      it('Should return tracked Category primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCategoryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEntityMById', () => {
      it('Should return tracked EntityM primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEntityMById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
