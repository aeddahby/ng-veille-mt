import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEntityM } from '../entity-m.model';
import { EntityMService } from '../service/entity-m.service';

@Component({
  templateUrl: './entity-m-delete-dialog.component.html',
})
export class EntityMDeleteDialogComponent {
  entityM?: IEntityM;

  constructor(protected entityMService: EntityMService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.entityMService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
