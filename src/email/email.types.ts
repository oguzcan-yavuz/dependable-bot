export type EmailEntity = {
  to: string;
  title: string;
  message: string;
};

export const EmailQueue = 'emails';

export enum EmailJobs {
  sendEmail = 'sendEmail',
}
