import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class GetCoordsByAddressService {
  async getCoords(encodeAddress: string) {
    try {
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeAddress}&key=${process.env.OPEN_CAGE_API_KEY}&language=ru&pretty=1`
      );
      const resJson = await res.json();

      if (resJson.status.code == 402) {
        throw new HttpException(
          "Превышена квота запросов, попробуйте позже!",
          HttpStatus.PAYMENT_REQUIRED
        );
      }

      if (!resJson.results.length) {
        throw new HttpException("Некорректный адрес", HttpStatus.BAD_REQUEST);
      }

      const addressCoords = resJson.results[0].geometry;

      return { lat: addressCoords.lat, lon: addressCoords.lng };
    } catch (error) {
      throw new HttpException("Произошла ошибка!", HttpStatus.BAD_REQUEST);
    }
  }
}
