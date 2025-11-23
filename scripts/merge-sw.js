const fs = require("fs");
const path = require("path");

console.log("➡️  Procurando ngsw-worker.js...");

const possiblePaths = [
  path.join(__dirname, "..", "dist", "tudu", "browser"), // build padrão Angular >17
  path.join(__dirname, "..", "dist", "tudu"), // build do ngx-build-plus
  path.join(__dirname, "..", "dist"), // fallback
];

let distPath = null;
let swPath = null;

// encontra automaticamente o ngsw-worker.js
for (const p of possiblePaths) {
  const candidate = path.join(p, "ngsw-worker.js");
  if (fs.existsSync(candidate)) {
    distPath = p;
    swPath = candidate;
    break;
  }
}

if (!swPath) {
  console.error("❌ ngsw-worker.js NÃO encontrado em nenhum path conhecido.");
  console.error("Paths verificados:", possiblePaths);
  process.exit(1);
}

console.log("✅ ngsw-worker.js encontrado em:", swPath);

const customSwPath = path.join(distPath, "custom-sw.js");

// Valida custom-sw.js
if (!fs.existsSync(customSwPath)) {
  console.error("❌ custom-sw.js não encontrado em:", customSwPath);
  process.exit(1);
}

console.log("➡️  Lendo arquivos...");
const angularSw = fs.readFileSync(swPath, "utf8");
const customSw = fs.readFileSync(customSwPath, "utf8");

console.log("➡️  Mesclando...");

const merged = `${angularSw}\n\n/* ===== CUSTOM PUSH HANDLER ===== */\n${customSw}`;

fs.writeFileSync(swPath, merged);

console.log("✅ Service Worker mesclado com sucesso!");
