import { IsNotEmpty, IsEmail, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 'https://github.com/nestjs/nest',
    description: 'The url of the repository',
  })
  @IsNotEmpty()
  @IsUrl()
  repositoryUrl: string;

  @ApiProperty({
    example: ['email@example.com', 'info@example.com'],
    description: 'Email addresses to report outdated dependencies',
  })
  @IsEmail({}, { each: true })
  emails: string[];
}
