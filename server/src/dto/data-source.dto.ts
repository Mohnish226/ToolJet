import { Transform } from 'class-transformer';
import { IsUUID, IsString, IsObject, IsNotEmpty } from 'class-validator';
import { sanitizeInput } from 'src/helpers/utils.helper';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDataSourceDto {
  @IsUUID()
  app_id: string;

  @IsUUID()
  app_version_id: string;

  @IsString()
  @Transform(({ value }) => sanitizeInput(value))
  kind: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeInput(value))
  name: string;

  @IsObject()
  options: object[];
}

export class UpdateDataSourceDto extends PartialType(CreateDataSourceDto) {}
export class TestDataSourceDto extends PartialType(CreateDataSourceDto) {}

export class GetDataSourceOauthUrlDto {
  @IsString()
  @IsNotEmpty()
  provider: string;
}

export class AuthorizeDataSourceOauthDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}