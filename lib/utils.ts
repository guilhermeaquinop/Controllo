import { createCn } from 'cn/config'

// Junta classes do Tailwind resolvendo conflitos (como o tailwind-merge).
// A escala de texto do design system (app/globals.css) precisa ser registrada aqui:
// sem isso, "text-label" seria lido como cor e descartado ao lado de "text-money-in".
export const cn = createCn({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'title', 'heading', 'section', 'body', 'label', 'caption', 'chip'] }],
    },
  },
})
