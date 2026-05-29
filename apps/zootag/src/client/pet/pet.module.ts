import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTPet, ZTPetBreed, ZTDevice } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { PetProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTPet, ZTPetBreed, ZTDevice])],
  controllers: [PetController],
  providers: [PetService, PetProfile],
})
export class ClientPetModule {}
