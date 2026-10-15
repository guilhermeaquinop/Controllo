// Desliga o reinício automático dos contêineres do Supabase deste projeto (política "no").
// Usado por `npm run db:start` e `npm run db:reset` (o reset recria o contêiner do banco
// com a política padrão do CLI, "unless-stopped"). Também roda sozinho: node scripts/sem-reinicio.mjs
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// Mesmo valor de project_id em supabase/config.toml; o CLI o usa no nome dos contêineres.
const PROJETO = "controllo";

export function desligarReinicio() {
  const ids = execFileSync("docker", ["ps", "-q", "--filter", `name=_${PROJETO}$`], {
    encoding: "utf8",
  })
    .split(/\s+/)
    .filter(Boolean);

  if (ids.length === 0) {
    console.error("Nenhum contêiner do Supabase encontrado para desligar o reinício automático.");
    process.exit(1);
  }

  execFileSync("docker", ["update", "--restart=no", ...ids], { stdio: "ignore" });
  console.log(`Reinício automático desligado em ${ids.length} contêineres.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) desligarReinicio();
