// Sobe o Supabase local e desliga o reinício automático dos contêineres.
// Equivale a um comando Artisan customizado (php artisan ...), chamado por `npm run db:start`.
//
// O Supabase CLI cria os contêineres com a política "unless-stopped", que os religa
// sempre que o Docker abre. Aqui ela vira "no": eles só sobem com este comando e
// ficam no ar até `npm run db:stop`, como num `docker-compose up -d` comum.
import { spawnSync } from "node:child_process";
import { desligarReinicio } from "./sem-reinicio.mjs";

// Argumentos extras são repassados ao CLI: npm run db:start -- -x studio
const comando = ["npx", "supabase", "start", ...process.argv.slice(2)].join(" ");
const inicio = spawnSync(comando, { stdio: "inherit", shell: true });
if (inicio.status !== 0) process.exit(inicio.status ?? 1);

desligarReinicio();
