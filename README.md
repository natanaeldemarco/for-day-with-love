# For Day, with love.

Una pequeña experiencia web por nuestros ocho meses.
Tiene cinco escenas: la invitación, nuestro vinilo, ocho meses en una historia, dos lugares con un mismo sentimiento y la carta.

Está hecha con HTML, CSS y JavaScript, sin frameworks y sin dependencias que instalar. La música se reproduce con el reproductor oficial de YouTube (`youtube-nocookie.com`), así que no se descarga ni se incluye ningún archivo de audio.

---

## Estructura

```
for-day-with-love/
├── index.html          → estructura de las 5 escenas
├── styles.css          → estilos y animaciones
├── script.js           → lógica (sobre, vinilo + YouTube, historia, cielo, carta)
├── config.js           → TODOS los textos, fechas, colores y la canción
├── README.md
└── assets/
    ├── illustrations/  → sello de cera, pétalos, flores prensadas
    ├── textures/       → papel, madera, grano
    └── fonts/          → Cormorant Garamond, EB Garamond, Caveat (licencia OFL)
```

## Cómo editar

Todo lo que se puede cambiar está en **`config.js`**:

| Qué querés cambiar | Dónde |
|---|---|
| Texto de la carta | `letter.paragraphs` (un elemento por párrafo) |
| Velocidad de escritura de la carta | `letter.typingSpeed` (ms por letra) |
| Frase final y firma | `letter.finalLine`, `letter.signature` |
| Canción | `music.youtubeId` (lo que va después de `watch?v=`), `music.title`, `music.artist` |
| Etiqueta del disco | `music.labelTop`, `music.labelBottom` |
| Fechas e historia | `story.moments` (fecha, título, texto e ilustración) |
| Colores | `colors` |

Ilustraciones disponibles para cada fecha (`art`): `calendar`, `map`, `constellation` y `stamps`.

## Probarlo en tu computadora

Por seguridad, los navegadores no cargan las tipografías si abrís `index.html` con doble clic. Levantá un servidor local desde la carpeta:

```bash
cd for-day-with-love
python3 -m http.server 8000
```

Después abrí `http://localhost:8000`.

Para ir directo a una escena mientras probás, agregá `#escena-1` … `#escena-5` al final del enlace (por ejemplo, `http://localhost:8000/#escena-5`).

---

## Publicarlo gratis en GitHub Pages

### 1. Crear el repositorio
1. Entrá a <https://github.com> e iniciá sesión (o creá una cuenta gratis).
2. Arriba a la derecha tocá **+ → New repository**.
3. En **Repository name** poné, por ejemplo, `for-day-with-love`.
4. Elegí **Public**. GitHub Pages gratis requiere que el repositorio sea público.
5. Tocá **Create repository**.

### 2. Subir los archivos
1. En el repositorio nuevo, tocá **uploading an existing file** (o **Add file → Upload files**).
2. Descomprimí el `.zip` en tu computadora y arrastrá **el contenido** de la carpeta `for-day-with-love`: `index.html`, `styles.css`, `script.js`, `config.js`, `README.md` y la carpeta `assets`.
   ⚠️ `index.html` tiene que quedar en la raíz del repositorio, no dentro de otra carpeta.
3. Abajo tocá **Commit changes**.

### 3. Activar GitHub Pages
1. En el repositorio, entrá a **Settings → Pages** (en el menú de la izquierda).
2. En **Build and deployment → Source**, elegí **Deploy from a branch**.
3. En **Branch**, elegí `main` y la carpeta `/ (root)`. Tocá **Save**.

### 4. Obtener el enlace
Esperá uno o dos minutos y recargá **Settings → Pages**. Arriba vas a ver algo así:

```
Your site is live at https://TU-USUARIO.github.io/for-day-with-love/
```

Ese es el enlace para mandarle a Day.

### 5. Probarlo en iPhone y Android
- **iPhone (Safari):** abrí el enlace, tocá el sobre, entrá al vinilo y tocá Play.
  Si la música no arranca con el botón, tocá directamente sobre el video de abajo. Es una regla de Safari: a veces exige que el primer toque sea sobre el video. Desde ahí, el tocadiscos se sincroniza solo.
  En iPhone, el volumen se maneja con los botones físicos (Apple no deja controlarlo desde una página web).
- **Android (Chrome):** el botón Play y el control de volumen funcionan directamente.
- Probá también con el iPhone en **modo silencio**: Safari puede reproducir el sonido del video igual, pero conviene revisarlo.
- Recorré las 5 escenas con **Seguir** y probá deslizar las fechas en la escena 3.

### Si el video no se puede reproducir
Si aparece *"El dueño del video no permite reproducirlo fuera de YouTube"*, ese video tiene bloqueada la reproducción en otras páginas. Buscá otra versión oficial de la canción (por ejemplo, el *audio oficial* o el *lyric video* del canal del artista) y reemplazá `music.youtubeId` en `config.js`.

### Actualizar algo después
Editá el archivo directamente en GitHub (abrilo y tocá el ícono del lápiz ✏️) y guardá con **Commit changes**. La página se actualiza sola en uno o dos minutos.

---

## Detalles técnicos

- Funciona en Safari iOS y Chrome Android, en vertical, y respeta las zonas seguras del iPhone (notch y barra inferior).
- Respeta la opción **Reducir movimiento** del sistema: sin pétalos ni parpadeos, la carta aparece completa y el disco gira lento.
- El disco y el brazo responden al **estado real** del reproductor de YouTube. Si pausás desde el video, el disco también se detiene.
- La música sigue sonando aunque cambies de escena. En la esquina aparece un mini-vinilo para pausarla.
- No se guarda ningún dato y no hay cookies propias. El reproductor usa el dominio de privacidad mejorada de YouTube.
- Tipografías con licencia SIL Open Font License (ver `assets/fonts/LICENCIAS.txt`).
