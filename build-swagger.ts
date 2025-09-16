import fs from "fs";
import path from "path";

const swaggerDir = path.resolve("./application/view");
const files = fs.readdirSync(swaggerDir).filter(f => f.endsWith(".json") && f !== "init.json");

const initSwagger: any = {
  openapi: "3.0.0",
  info: { title: "Application Programming Interface", version: "1.0.0" },
  paths: {},
  components: {}
};

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(swaggerDir, file), "utf8"));

  // Merge paths
  if (content.paths) Object.assign(initSwagger.paths, content.paths);

  // Merge components hanya kalau ada di file
  if (content.components) {
    initSwagger.components = {
      ...initSwagger.components,
      ...content.components,
      securitySchemes: {
        ...(initSwagger.components.securitySchemes || {}),
        ...(content.components.securitySchemes || {})
      },
      parameters: {
        ...(initSwagger.components.parameters || {}),
        ...(content.components.parameters || {})
      }
    };
  }
}

fs.writeFileSync(path.join(swaggerDir, "init.json"), JSON.stringify(initSwagger, null, 2));
console.log("✅ init.json updated dynamically with each file's components!");
