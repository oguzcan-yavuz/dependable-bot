import { IsNotEmpty, IsEmail, IsUrl } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsUrl()
  repositoryUrl: string;

  @IsEmail({}, { each: true })
  emails: string[];
}
