import * as fs from "fs";
import * as path from "path";

export const deleteStaticFiles = (fileName: string) => {
  fs.unlinkSync(
    path.join(__dirname, "../../", "src", "static", "uploads", fileName)
  );
};
