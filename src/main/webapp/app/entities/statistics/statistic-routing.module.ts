import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TicketRoutingResolveService } from '../ticket/route/ticket-routing-resolve.service';
import { StatisticComponent } from './statistic.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticComponent,
    resolve: {
      ticket: TicketRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticRoutingModule {}
