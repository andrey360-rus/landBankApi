import { Injectable } from "@nestjs/common";

@Injectable()
export class DatesService {
  parseDate(date: string) {
    const now = new Date();

    const day = Number(date.split(".")[0]);
    const month = Number(date.split(".")[1]);
    const year = Number(date.split(".")[2]);

    now.setDate(day);
    now.setMonth(month - 1);
    now.setFullYear(year);

    const newDate = now;

    return newDate;
  }

  formateDate(date: Date): string {
    let dd: string | number = date.getDate();
    if (dd < 10) dd = "0" + dd;

    let mm: string | number = date.getMonth() + 1;
    if (mm < 10) mm = "0" + mm;

    const yyyy: string | number = date.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  }
}
