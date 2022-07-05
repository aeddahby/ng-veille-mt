import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EntityMComponent } from '../list/entity-m.component';
import { EntityMDetailComponent } from '../detail/entity-m-detail.component';
import { EntityMUpdateComponent } from '../update/entity-m-update.component';
import { EntityMRoutingResolveService } from './entity-m-routing-resolve.service';

const entityMRoute: Routes = [
  {
    path: '',
    component: EntityMComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EntityMDetailComponent,
    resolve: {
      entityM: EntityMRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EntityMUpdateComponent,
    resolve: {
      entityM: EntityMRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EntityMUpdateComponent,
    resolve: {
      entityM: EntityMRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(entityMRoute)],
  exports: [RouterModule],
})
export class EntityMRoutingModule {}
