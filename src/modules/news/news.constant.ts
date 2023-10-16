import { randomUUID } from "crypto";
import { diskStorage } from "multer";

export const storage = {
  storage: diskStorage({
    destination: "./src/static/articles",
    filename: (req, file, cb) => {
      const uuid = randomUUID();
      const fileExt = file.originalname.split(".").pop();
      const filename = `${uuid}.${fileExt}`;

      cb(null, filename);
    },
  }),
};
