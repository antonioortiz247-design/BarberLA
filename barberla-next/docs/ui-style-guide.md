# Auditoría visual y sistema de diseño (referencia: tacos-ricos.vercel.app)

## 1) Resumen visual

- **Color:** combinación de fondos oscuros + acentos cálidos (naranja/amarillo) para foco en CTA.
- **Tipografía:** sans geométrica, títulos grandes con tracking negativo, cuerpo legible y espaciado generoso.
- **Layout:** contenedor central (~1120px), hero de 2 columnas desktop y 1 columna mobile.
- **Espaciado:** escala base 4/8px aplicada a paddings, gap y márgenes.
- **Componentes clave:** header sticky, hero con doble CTA, cards informativas, stats, CTA final y footer de columnas.
- **Visual style:** bordes suaves, radios medianos/grandes, blur ligero y gradientes radiales en fondo.
- **Interacción:** hover con elevación ligera, cambios de color en enlaces, foco visible con ring AA.
- **Responsive:** mobile-first, reducción de densidad y simplificación de navegación en pantallas pequeñas.

## 2) Tokens y decisiones

### Tokens base (`:root`)
- `--color-*`: define background/surface/text/brand/states.
- `--radius-*`: define consistencia de esquinas por componente.
- `--shadow-*`: define profundidad de cards y CTA.
- `--space-*`: define escala de spacing (4, 8, 12, 16, 24, 32).
- `--font-*`: controla familia para títulos y textos.

### Modo oscuro
- `.dark` sobrescribe variables de color para mantener contraste alto.

### Mapeo a Tailwind
- `tailwind.config.ts` expone tokens en `colors`, `borderRadius`, `boxShadow`, `spacing`, `fontFamily`.

## 3) Guía breve de uso

- **Button default:** CTA principal (acciones de alta prioridad).
- **Button outline:** acciones secundarias sin perder jerarquía.
- **Button ghost:** acciones terciarias o enlaces utilitarios.
- **Card:** bloques de contenido y métricas.
- **Badge:** etiquetas de categoría/contexto.
- **SectionTitle:** encabezado estándar de sección para consistencia vertical.

## 4) Accesibilidad

- Contraste pensado para cumplir WCAG AA en texto principal y botones.
- Estados de foco visibles en elementos interactivos (`focus-visible:ring`).
- Uso de `aria-label` en enlaces críticos.
