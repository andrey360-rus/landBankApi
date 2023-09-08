import { Module } from "@nestjs/common";
import { GetCoordsByAddressService } from "./get-coords-by-address.service";

@Module({
  providers: [GetCoordsByAddressService],
  exports: [GetCoordsByAddressService],
})
export class GetCoordsByAddressModule {}
