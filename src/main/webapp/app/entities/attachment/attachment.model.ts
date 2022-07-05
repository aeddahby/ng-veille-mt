import { ITicket } from 'app/entities/ticket/ticket.model';

export interface IAttachment {
  id?: number;
  name?: string | null;
  attachContentType?: string | null;
  attach?: string | null;
  ticket?: ITicket | null;
}

export class Attachment implements IAttachment {
  constructor(
    public id?: number,
    public name?: string | null,
    public attachContentType?: string | null,
    public attach?: string | null,
    public ticket?: ITicket | null
  ) {}
}

export function getAttachmentIdentifier(attachment: IAttachment): number | undefined {
  return attachment.id;
}
