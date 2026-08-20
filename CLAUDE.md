# Estudio Longitudinal — propuesta de noviazgo

Sitio web de una sola página para proponerle noviazgo a Lau. Tema visual:
"paper científico / cuaderno de campo de biología", con paleta verde
salvia + crema y tipografía redondeada. Es un sitio estático, sin
build step: se edita directo y se abre en el navegador.

## Stack técnico

- **HTML/CSS/JS puro**, sin framework ni bundler. `index.html` +
  `style.css` + `script.js`.
- **Fuentes** (Google Fonts, vía `<link>` en `index.html`):
  - `Fredoka` — encabezados, títulos, botones, etiquetas (`--font-display`)
  - `Quicksand` — cuerpo de texto, párrafos, descripciones (`--font-body`)
  - `Caveat` — acentos manuscritos puntuales (`--font-hand`)
- **Node.js solo como herramienta de build de assets** (no para servir
  el sitio): `jimp`, `heic-convert` y `gifsicle` como dependencias de
  `package.json`, usadas por los scripts utilitarios (ver abajo). Se
  necesita `npm install` una vez para tenerlos disponibles.
- **Servidor de desarrollo**: `npx serve` (configurado en
  `.claude/launch.json` para el preview del entorno Claude Code, puerto
  8642). No hace falta para ver el sitio — también funciona con doble
  clic en `index.html`.

## Arquitectura / estructura de la página

Una sola página larga (`index.html`), scroll vertical, secciones en este
orden (cada una es un `<section class="section ...">` de `100svh` mínimo
con su propio `id`):

1. `#hero` — título científico grande + eyebrow (actualmente sin
   "para Lau" ni subtítulo, se sacaron a pedido)
2. `#observation` — "La observación" (nota de campo)
3. `#counter` — contador de días (JS, ver `START_DATE` abajo)
4. `#hypothesis` — "La hipótesis"
5. `#variables` — variables del experimento (independiente/dependiente/
   entorno controlado)
6. `#gallery` — "Evidencia empírica": galería de 26 fotos numeradas
   "Muestra 1" a "Muestra 26", en 3 `.gallery-group` (mosaico por
   columnas CSS, sin subtítulos de categoría visibles)
7. `#timeline` — "Registro de observaciones" / bitácora de campo, 4
   hitos con íconos de hoja recortados de una imagen de referencia
   (`assets/icons/icon-leaf-bit1..4.png`)
8. `#letter` — "El informe final": sobre animado (SVG, se abre con
   clic) con una carta dentro
9. `#question` — la pregunta final + botones, con celebración animada
   (confetti, 8 GIFs, audio) al confirmar

### Sistema de íconos decorativos

Dos tipos conviven:
- **SVG inline** (`<symbol>` + `<use>` en un sprite al principio del
  `<body>`): íconos dibujados a mano en el mismo estilo de línea
  (hongos, ADN, tubo de ensayo, molécula, célula, bacteria, etc.).
  Usan `stroke="currentColor"` así heredan el color por CSS.
- **PNG recortados** (`assets/icons/*.png`): extraídos de imágenes de
  referencia que fue mandando el usuario (fondo verde removido con
  scripts de Node + Jimp, ver `extract-icons.js` y
  `extract-bitacora-icons.js`). No soportan `currentColor` — el color
  de línea queda fijo al de la imagen original.

Todos los elementos decorativos usan la clase `.deco` + una clase
específica de posición (`.deco-mushroom-1`, `.deco-dna-2`, etc.) que
define `top/left/right/bottom`, tamaño y animación (`float` o `sway`).

### Sobre y carta (`#letter`)

Construido con SVG (no `clip-path`) para que el pliegue tenga un borde
prolijo: `.envelope-back` (rectángulo con esquinas apenas redondeadas),
`.envelope-flap` (triángulo SVG con `fill` + `stroke`), sello de corazón
como contorno SVG centrado en la punta del pliegue (no en una esquina).
El JS (`initEnvelope` en `script.js`) solo alterna la clase `.open` en
`#envelope`, todo lo demás es CSS (`rotateX` en el pliegue, `translateY`
en la carta).

### Botón "No" esquivo

`initDodgeButton()` en `script.js`: detecta la posición del mouse
(`mousemove` global) y, si se acerca a menos de 160px del botón, lo
teletransporta a `position: fixed` a un punto aleatorio de la pantalla
que esté a más de 260px del cursor. En touch, esquiva al tocar. El
texto del botón cambia después de 3 y 8 esquives (sin emojis).

### Celebración final

Al tocar "Confirmar mutualismo" (`initQuestion()`):
1. Se saca `hidden` de `#celebration` (¡importante!: `.celebration` no
   puede tener `display` propio sin una regla `.celebration[hidden] {
   display: none; }` con más especificidad, si no el `hidden` de HTML
   queda pisado por el CSS — ya pasó este bug una vez).
2. `spawnConfetti()` dispara 3 oleadas de piezas (rectángulos, círculos
   y emojis) con caída + rotación + deriva horizontal.
3. Se muestran 8 GIFs (`assets/gif/gif1.gif` a `gif8.gif`, comprimidos
   con gifsicle) repartidos alrededor del texto con animación de
   aparición escalonada.
4. Se reproduce `assets/audio/audiosi.ogg` — funciona porque el
   click real del usuario cuenta como gesto de usuario para el
   autoplay; si se dispara por JS synthetic click, el navegador puede
   bloquear el audio silenciosamente.

## Cómo personalizar (ver también `README.md`, más detallado)

Casi todo el texto editable está marcado con `data-edit="..."` en
`index.html` — son los puntos pensados para tocar directamente. La
lista completa de qué es cada `data-edit` está en `README.md`.

### Scripts utilitarios (Node, requieren `npm install` una vez)

- `convert-heic.js` — convierte `.HEIC`/`.heic` a `.jpg` (no borra los
  originales)
- `resize-photos.js` — comprime/redimensiona `assets/photos/foto*.jpg`
  a máx. 1600px, calidad 82
- `extract-icons.js` — recorta sprites 2x2 de íconos y les quita el
  fondo (chroma key) → `assets/icons/`
- `extract-bitacora-icons.js` — mismo proceso pero para la imagen
  vertical de 4 íconos de la bitácora

## ⚠️ Gotchas conocidos

1. **El proyecto vive dentro de OneDrive.** Ya pasó una vez que
   OneDrive resincronizó y restauró los nombres originales de las fotos
   (`IMG_xxxx.jpg`), pisando los `fotoN.jpg` que arma el sitio y
   rompiendo la galería. Si las fotos aparecen en blanco, ese es el
   primer sospechoso — hay que volver a copiarlas con el nombre
   `fotoN.jpg` y correr `node resize-photos.js`. Si pasa seguido,
   convendría mover el proyecto fuera de OneDrive.
2. **`START_DATE` en `script.js` es una fecha calibrada, no
   necesariamente la fecha real de aniversario.** Está fijada en
   `"2022-04-06"` para que el contador mostrará 1595 días el
   2026-08-18 (pedido explícito del usuario en su momento). Si esa NO
   es la fecha real en que empezaron, hay que ajustarla.
3. **El panel de preview del entorno Claude Code fue inconsistente
   durante todo el desarrollo** (screenshots en blanco, clics que no
   registran, coordenadas desfasadas). No es un bug del sitio — se
   verificó repetidamente con inspección de DOM/JS y clics reales que
   la funcionalidad en sí anda bien. Si algo parece no funcionar en el
   preview, probar primero en un navegador real (doble clic a
   `index.html`, o `npx serve` y abrir en Chrome/Edge normal).
4. **`.polaroid-grid` usa CSS multi-column (`column-count`)**, no CSS
   Grid — es intencional, para que las fotos con distinto alto/ancho
   se acomoden en mosaico. Si se cambia a `display: grid` el orden de
   lectura pasa de "columna por columna" a "fila por fila", que es una
   decisión de diseño, no un bug — ya se discutió esto con el usuario.

## Estado actual: completo

No quedan placeholders de texto genérico — todo el contenido (títulos,
variables, bitácora, carta, captions de las 26 muestras) tiene texto
real puesto por el usuario. El sitio está funcionalmente terminado.

## Posibles próximos pasos (no pedidos aún, ideas)

- Confirmar que `START_DATE` sea la fecha real (ver gotcha #2).
- Decidir si el proyecto se saca de OneDrive antes de mandarle el link
  a Lau, para evitar el problema de sincronización (gotcha #1).
- Si se va a compartir el link, pensar cómo hostearlo (GitHub Pages,
  Netlify, Vercel — todos gratis para un sitio estático así). Hoy solo
  corre localmente.
- Revisar en un celular real (no solo el preview) que el audio suene
  bien — `.ogg` no lo soporta Safari/iOS nativamente; si Lau usa
  iPhone, puede hacer falta convertir el audio a `.mp3` o `.m4a`.
- Los archivos originales sin comprimir en `assets/photos/` (los
  `IMG_*.jpg` / `.HEIC`, no los `fotoN.jpg`) no se usan en el sitio y
  pesan ~68 MB en total — se podrían borrar para aligerar el repo si
  ya no hacen falta como respaldo.
