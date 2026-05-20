import { ApiProperty } from '@nestjs/swagger';

export class ContractStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Contract Status ID' })
  id: number;

  @ApiProperty({ example: 'Active', description: 'Contract status name' })
  name: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
