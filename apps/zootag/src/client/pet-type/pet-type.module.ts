import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTPetType } from '@rahino/localdatabase/models';
import { PetTypeController } from './pet-type.controller';
import { PetTypeService } from './pet-type.service';

@Module({
  imports: [SequelizeModule.forFeature([ZTPetType])],
  controllers: [PetTypeController],
  providers: [PetTypeService],
})
export class ClientPetTypeModule {}
