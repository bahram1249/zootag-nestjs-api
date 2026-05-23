import { ApiProperty } from '@nestjs/swagger';

export class CommissionSettlementStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Commission Settlement Status ID' })
  id: number;

  @ApiProperty({
    example: 'pending',
    description: 'Commission settlement status name',
  })
  name: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
