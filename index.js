import path from "path";
import fs from "fs";
// import transformer from './transforms/extract-json-schema-defaults.js';
// import pick from "./transforms/pick.js";
import step1 from "./transforms/readouts/step-1.js";
import step2 from "./transforms/readouts/step-2.js";
import step3 from "./transforms/readouts/step-3.js";
// const RESOURCE = 'test-outer-schema';
// const RESOURCE = 'bottom-sheet/ios-2_0-outer';
// const RESOURCE = 'bottom-sheet/custom-outer';
// const RESOURCE = "experiment-reports/e04c50c1-7cf0-474c-b071-f61a05e58eb9";
const RESOURCE = "experiment-reports/f702b81b-9ba6-4bac-9aaf-573a934b5af4";

const resourceFolderPath = path.join("./", "resources");
const inputPath = path.join(resourceFolderPath, `${RESOURCE}.json`);
const input = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

// console.log(JSON.stringify(step1(input)));
console.log(JSON.stringify(step2(input)));
// console.log(JSON.stringify(step3(input)));
