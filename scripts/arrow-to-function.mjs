import fs from "fs"; import path from "path";

const roots = ["src/app", "src/components", "src/features", "src/modules", "src/lib", "src/widgets"];
const exts = new Set([".tsx",".ts",".jsx",".js"]);

function walk(dir, out=[]) {
  for (const e of fs.readdirSync(dir, { withFileTypes:true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (exts.has(path.extname(p))) out.push(p);
  }
  return out;
}

const files = roots.flatMap(r => fs.existsSync(r) ? walk(r) : []);

const re = /export\s+const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(([\s\S]*?)\)\s*=>\s*\{([\s\S]*?)\n\};?/g;

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  if (!re.test(src)) continue;
  let idx = 0; re.lastIndex = 0;
  const out = src.replace(re, (_m, name, params, body) => {
    idx++;
    return `export function ${name}(${params}) {\n${body}\n}\n`;
  });
  if (idx>0) {
    fs.writeFileSync(f+".bak", src);
    fs.writeFileSync(f, out);
    console.log(`🔁 converted: ${f}  (${idx} change)`);
  }
}
