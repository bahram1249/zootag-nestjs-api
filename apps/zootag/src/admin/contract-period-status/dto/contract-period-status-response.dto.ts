import { ApiProperty } from '@nestjs/swagger';

export class ContractPeriodStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Contract Period Status ID' })
  id: number;

  @ApiProperty({ example: 'Active', description: 'Contract period status name' })
  name: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
