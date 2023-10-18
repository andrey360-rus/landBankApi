import * as fs from "fs";
import * as path from "path";

export const deleteStaticFiles = (folder: string, fileName: string) => {
  fs.unlinkSync(
    path.join(__dirname, "../../", "src", "static", folder, fileName)
  );
};
