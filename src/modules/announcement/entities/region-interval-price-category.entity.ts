import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Region } from "./region.entity";

@Entity("region_interval_price_category")
export class RegionIntervalPriceCategory {
  @PrimaryColumn()
  id: number;

  @Column("int", { name: "min_price" })
  minPrice: number;

  @Column("numeric", { name: "max_price" })
  maxPrice: number;

  @OneToMany(() => Region, (region) => region.intervalPriceCategory)
  regions: Region[];
}
