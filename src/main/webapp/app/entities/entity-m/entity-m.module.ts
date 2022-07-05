import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EntityMComponent } from './list/entity-m.component';
import { EntityMDetailComponent } from './detail/entity-m-detail.component';
import { EntityMUpdateComponent } from './update/entity-m-update.component';
import { EntityMDeleteDialogComponent } from './delete/entity-m-delete-dialog.component';
import { EntityMRoutingModule } from './route/entity-m-routing.module';

@NgModule({
  imports: [SharedModule, EntityMRoutingModule],
  declarations: [EntityMComponent, EntityMDetailComponent, EntityMUpdateComponent, EntityMDeleteDialogComponent],
  entryComponents: [EntityMDeleteDialogComponent],
})
export class EntityMModule {}
