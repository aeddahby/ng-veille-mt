import dayjs from 'dayjs/esm';
import { IDirectionRegionale } from 'app/entities/direction-regionale/direction-regionale.model';
import { ICategory } from 'app/entities/category/category.model';
import { IEntityM } from 'app/entities/entity-m/entity-m.model';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { StateTicket } from 'app/entities/enumerations/state-ticket.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface ITicket {
  id?: number;
  object?: string | null;
  description?: string | null;
  creationDate?: dayjs.Dayjs | null;
  modificationDate?: dayjs.Dayjs | null;
  closedDate?: dayjs.Dayjs | null;
  contributor?: string | null;
  contributorVisibility?: boolean | null;
  entityVisibility?: boolean | null;
  directionVisibility?: boolean | null;
  centralAnimator?: string | null;
  centralRelay?: string | null;
  regionalRelay?: string | null;
  stateTicket?: StateTicket | null;
  statusTicket?: Status | null;
  pertinence?: boolean | null;
  directionRegionale?: IDirectionRegionale | null;
  category?: ICategory | null;
  entity?: IEntityM | null;
  attachments?: IAttachment[] | null;
}

export class Ticket implements ITicket {
  constructor(
    public id?: number,
    public object?: string | null,
    public description?: string | null,
    public creationDate?: dayjs.Dayjs | null,
    public modificationDate?: dayjs.Dayjs | null,
    public closedDate?: dayjs.Dayjs | null,
    public contributor?: string | null,
    public contributorVisibility?: boolean | null,
    public entityVisibility?: boolean | null,
    public directionVisibility?: boolean | null,
    public centralAnimator?: string | null,
    public centralRelay?: string | null,
    public regionalRelay?: string | null,
    public stateTicket?: StateTicket | null,
    public statusTicket?: Status | null,
    public pertinence?: boolean | null,
    public directionRegionale?: IDirectionRegionale | null,
    public category?: ICategory | null,
    public entity?: IEntityM | null,
    public attachments?: IAttachment[] | null
  ) {
    this.contributorVisibility = this.contributorVisibility ?? false;
    this.entityVisibility = this.entityVisibility ?? false;
    this.directionVisibility = this.directionVisibility ?? false;
    this.pertinence = this.pertinence ?? false;
  }
}

export function getTicketIdentifier(ticket: ITicket): number | undefined {
  return ticket.id;
}
