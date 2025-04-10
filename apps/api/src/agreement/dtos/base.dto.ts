import { IsString } from 'class-validator';

export class CredentialSubject {
  @IsString()
  id: string;

  @IsString()
  type: string;
}

export class GaxIdReference {
  @IsString()
  id: string;
}

export class GaxAddress {
  @IsString()
  'gx:countrySubdivisionCode': string;
}

export class GaxDataAccountExport {
  @IsString()
  'gx:requestType': string;

  @IsString()
  'gx:accessType': string;

  @IsString()
  'gx:formatType': string;
}
