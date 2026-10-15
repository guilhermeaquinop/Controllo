import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sem cacheComponents: todas as telas são por usuário (leem a sessão), então nada
  // é pré-renderizado. Renderização dinâmica clássica, como uma rota Laravel comum.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
