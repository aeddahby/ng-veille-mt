import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ticket',
        data: { pageTitle: 'Tickets' },
        loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketModule),
      },
      {
        path: 'attachment',
        data: { pageTitle: 'Attachments' },
        loadChildren: () => import('./attachment/attachment.module').then(m => m.AttachmentModule),
      },
      {
        path: 'direction-regionale',
        data: { pageTitle: 'DirectionRegionales' },
        loadChildren: () => import('./direction-regionale/direction-regionale.module').then(m => m.DirectionRegionaleModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'Categories' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'entity-m',
        data: { pageTitle: 'EntityMS' },
        loadChildren: () => import('./entity-m/entity-m.module').then(m => m.EntityMModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
