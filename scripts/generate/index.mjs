import { saveCodes } from "./handlers.mjs";
import csv from "csv-parser";
import * as fs from "fs";
import { generateCode } from "./utils.mjs";

const generate = async () => {
  const codes = [];
  if (!parseInt(process.env.SCRIPT_CODES_TO_GENERATE)) {
    fs.createReadStream(process.env.SCRIPT_CODES_TO_GENERATE).
      pipe(csv()).
      on("data", (data) => codes.push(data)).
      on("end", () => {
        processCodes(codes);
      });
  } else {
    for (let i = 0; i < process.env.SCRIPT_CODES_TO_GENERATE; i++) {
      const code = await generateCode(null);
      codes.push({ code });
    }
    processCodes(codes);
  }
};

const processCodes = (codes) => {
  if (codes.length > 25) {
    const maxBatchItemsCount = 25;
    for (let i = 0; i < codes.length; i += maxBatchItemsCount) {
      const chunk = codes.slice(i, i + maxBatchItemsCount);
      saveCodes(chunk).
        then((result) => console.log(result)).
        catch((e) => {
          console.error(e.message);
        });
    }
  } else {
    saveCodes(codes).
      then((result) => console.log(result)).
      catch((e) => {
        console.error(e.message);
      });
  }
};

await generate();