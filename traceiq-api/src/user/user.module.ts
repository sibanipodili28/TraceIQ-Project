import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { MongoDBModule } from "src/mongoDB/mongodb.module";
import { INTERFACES } from "./constants/interface.constants";

@Module({
  imports: [
    MongoDBModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: INTERFACES.IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}