import { writeFileSync, mkdirSync, rmSync } from "fs";

rmSync("src", { recursive: true, force: true });
mkdirSync("./src");

const TOTAL = 5_000;
const DEPTH = 5;
const WIDTH = Math.round(TOTAL / DEPTH);

const generate = (dir, ext, nextImp) => {
  mkdirSync(`./src/${dir}`);
  for (let i = 1; i < DEPTH + 1; i++) {
    let code = "";
    for (let j = 1; j < WIDTH + 1; j++) {
      const childFile = nextImp(`${i}_${j}`);
      code += `\nimport "${childFile}"`;
      writeFileSync(
        `src/${dir}${childFile.slice(1)}`,
        `window.foo = (${i},${j})`,
      );
    }
    code += `\nimport "${nextImp(i + 1)}"`;
    writeFileSync(`src/${dir}/${i}.${ext}`, code);
  }
  writeFileSync(
    `src/${dir}/${DEPTH + 1}.${ext}`,
    `
const app = document.createElement("div");
app.id = "app";
app.textContent = (performance.now() - window.start).toFixed(2);
document.body.appendChild(app);
`,
  );
};

generate("esm", "js", (i) => `./${i}.js`);
// generate("js", "js", (i) => `./${i}`);
// generate("ts", "ts", (i) => `./${i}`);