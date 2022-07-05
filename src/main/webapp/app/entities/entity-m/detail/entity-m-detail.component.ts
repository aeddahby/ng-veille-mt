import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEntityM } from '../entity-m.model';

@Component({
  selector: 'jhi-entity-m-detail',
  templateUrl: './entity-m-detail.component.html',
})
export class EntityMDetailComponent implements OnInit {
  entityM: IEntityM | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entityM }) => {
      this.entityM = entityM;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
