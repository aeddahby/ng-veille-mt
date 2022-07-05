import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EntityMService } from '../service/entity-m.service';
import { IEntityM, EntityM } from '../entity-m.model';

import { EntityMUpdateComponent } from './entity-m-update.component';

describe('EntityM Management Update Component', () => {
  let comp: EntityMUpdateComponent;
  let fixture: ComponentFixture<EntityMUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let entityMService: EntityMService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EntityMUpdateComponent],
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
      .overrideTemplate(EntityMUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntityMUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    entityMService = TestBed.inject(EntityMService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const entityM: IEntityM = { id: 456 };

      activatedRoute.data = of({ entityM });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(entityM));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EntityM>>();
      const entityM = { id: 123 };
      jest.spyOn(entityMService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entityM });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entityM }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(entityMService.update).toHaveBeenCalledWith(entityM);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EntityM>>();
      const entityM = new EntityM();
      jest.spyOn(entityMService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entityM });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entityM }));
      saveSubject.complete();

      // THEN
      expect(entityMService.create).toHaveBeenCalledWith(entityM);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EntityM>>();
      const entityM = { id: 123 };
      jest.spyOn(entityMService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entityM });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(entityMService.update).toHaveBeenCalledWith(entityM);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
