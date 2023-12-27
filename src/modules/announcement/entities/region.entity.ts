import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { RegionIntervalPriceCategory } from "./region-interval-price-category.entity";

@Entity("region")
export class Region {
  @PrimaryColumn("text", { name: "region_id" })
  regionId: string;

  @Column("text")
  title: string;

  @ManyToOne(() => RegionIntervalPriceCategory, (interval) => interval, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "region_interval_price_category_id" })
  intervalPriceCategory?: RegionIntervalPriceCategory;
}
