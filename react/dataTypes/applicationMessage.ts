export enum ApplicationMessageType {
    info = 'info',
    error = 'error',
}
export interface ApplicationMessage {
    message: string;
    type: ApplicationMessageType;
}