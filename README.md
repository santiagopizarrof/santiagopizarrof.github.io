# Estudio Longitudinal — para Lau

Sitio de una sola página con tema de "paper científico": portada → la
observación → días de observación (contador) → la hipótesis → variables
del experimento → evidencia empírica (galería de fotos) → bitácora de
campo (línea de tiempo) → informe final (carta) → la pregunta.

## Cómo verla

Abrí `index.html` haciendo doble clic (funciona sin instalar nada). Si las
fotos no se ven porque el navegador bloquea archivos locales, corré esto
en la carpeta del proyecto y abrí `http://localhost:8642`:

```bash
npx serve -l 8642 .
```

⚠️ **Esta carpeta está dentro de OneDrive.** Si en algún momento la
galería aparece rota (fotos en blanco), lo más probable es que OneDrive
haya vuelto a sincronizar los archivos originales (`IMG_xxxx.jpg`) y
haya pisado los `fotoN.jpg` que arma este sitio. La solución es
volver a copiarlos con el nombre `fotoN.jpg` y correr
`node resize-photos.js`. Si vuelve a pasar seguido, capaz conviene mover
esta carpeta fuera de OneDrive antes de mandarle el link a Lau.

## Cómo personalizarla

**1. Fotos** — hay 27 fotos en `assets/photos/` (`foto1.jpg` ...
`foto27.jpg`) agrupadas en 3 bloques dentro de "Evidencia empírica" (sin
subtítulo visible, pero en este orden): **en casa** (Muestras 1-10),
**salidas** (Muestras 11-17) y **aventuras al aire libre** (Muestras
18-27). Cada grupo es un `<div class="gallery-group reveal">` en
`index.html` con su propio `.polaroid-grid` adentro. Las fotos se
acomodan solas en mosaico según su forma real (una vertical ocupa más
alto, una horizontal queda más achatada) — no hace falta recortarlas.

Cada foto tiene un número fijo **Muestra 1** a **Muestra 27** (no
cambia aunque reordenes los grupos). Debajo del número hay un
`<span data-edit="caption-N">` vacío — ahí va el texto descriptivo de
esa muestra en particular. Decime qué poner en cada número (ej: "en la
Muestra 5 poné...") y lo completo.

Para cambiar una foto, reemplazá el archivo manteniendo el mismo nombre.
Para agregar más, duplicá un bloque `<figure class="polaroid reveal">...
</figure>` dentro del `.polaroid-grid` del grupo que corresponda y sumá
`fotoN.jpg` a la carpeta (seguí la numeración de `sample-number`).

Si agregás fotos en formato `.HEIC` (las que salen del iPhone), el
navegador no las puede mostrar. Corré esto para convertirlas a `.jpg`
automáticamente y comprimirlas (deja los originales sin tocar):

```bash
node convert-heic.js
node resize-photos.js
```

**2. Nombres y textos** — buscá en `index.html` los elementos con
`data-edit="..."` y cambiá el texto de adentro:
- `nombre-ella`: el nombre en el "para ___" de la portada (hoy dice Lau)
- `titulo-principal`: el título científico grande
- `observacion-texto`, `hipotesis-texto`: los textos de esas dos secciones
- `entorno-lugar`: el lugar en "Entorno controlado" (variables del experimento)
- `caption-1` a `caption-27`: el texto descriptivo de cada muestra (foto)
- `fecha-1` a `fecha-4` y `hito-1` a `hito-4`: la bitácora de campo (línea
  de tiempo — todavía tienen texto de ejemplo, hay que completarlos)
- `carta-texto` y `firma`: la conclusión del informe y quién la firma

**3. Contador de días** — en `script.js`, `START_DATE` está fijada en
`"2022-04-06"` para que muestre 1595 días al 18/08/2026 y siga sumando
desde ahí. Si esa fecha de inicio no es la correcta, cambiala.

**4. Tipografía** — el título y todos los encabezados usan **Fredoka**
(la alternativa gratuita más cercana a Bobby Jones: redondeada, gruesa,
amigable). Si querés probar otra, cambiá el `@import` de Google Fonts en
`index.html` y el valor de `--font-display` en `style.css`.

**5. Canción de la celebración** — ya está puesta: `assets/audio/audiosi.ogg`,
suena sola apenas toca "Confirmar mutualismo". Para cambiarla, reemplazá
ese archivo (mismo nombre) o cambiá el `src` del `<audio>` en
`index.html` (buscá `celebrationAudio`).

**6. GIFs de la celebración** — hay 8, en `assets/gif/gif1.gif` a
`gif8.gif`, repartidos alrededor del texto "Yupiiiiiiii". Ya vienen
comprimidos con gifsicle (de ~15 MB bajaron a ~4 MB en total) para que
la página no tarde en cargar esa parte. Para cambiar alguno, reemplazá
el archivo correspondiente manteniendo el nombre. Si querés agregar o
sacar alguno, cada uno es un `<img class="celebration-gif gif-N">` en
`index.html` con su posición en `style.css` (buscá `.gif-1` a `.gif-8`).

Si en el futuro necesitás comprimir más GIFs, ya está instalado
`gifsicle` en el proyecto:

```bash
node_modules/gifsicle/vendor/gifsicle.exe --resize-width 280 --colors 128 -O3 --lossy=60 entrada.gif -o salida.gif
```

## Estructura

```
index.html         estructura y contenido
style.css          paleta salvia/crema + rosa pastel (carta), tipografía, animaciones
script.js          contador, scroll reveal, sobre, botón esquivo, confetti
assets/photos/     tus fotos (foto1.jpg ... foto27.jpg)
assets/icons/      hongos, libélula, zorro, caballo, gato, ballena, flores (recortados y sin fondo)
convert-heic.js    convierte fotos .HEIC a .jpg
resize-photos.js   comprime las fotos para que la página cargue rápido
```
