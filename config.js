/* ============================================================
   FOR DAY, WITH LOVE — configuración central
   Todo lo que quieras cambiar (textos, fechas, colores, canción)
   está acá. No hace falta tocar index.html ni script.js.
   ============================================================ */

window.FDWL_CONFIG = {
  /* ---------- Colores ---------- */
  colors: {
    bordo: "#481D2A",       // bordó profundo
    vino: "#30131E",        // vino oscuro
    crema: "#F0E5D2",       // crema envejecido
    dorado: "#B69A68",      // dorado apagado
    rosa: "#C78F91",        // rosa antiguo
    negro: "#191516"        // negro cálido
  },

  /* ---------- Escena 1 · La invitación ---------- */
  invitation: {
    title: "For Day, with love.",
    subtitle: "Una pequeña sorpresa para vos.",
    hint: "Tocá el sobre",
    cardTitle: "Ocho meses y todavía te elegiría",
    cardDate: "16 · XI · 2026",
    button: "Abrir nuestro pequeño mundo"
  },

  /* ---------- Escena 2 · Nuestro vinilo ---------- */
  music: {
    youtubeId: "3pSkKcrSUZ8",          // https://www.youtube.com/watch?v=3pSkKcrSUZ8
    title: "Es Tan Grande Este Amor",
    artist: "Rodrigo Tapari",
    labelTop: "DAY",
    labelBottom: "16 · III · 2026",
    startVolume: 70,
    quote: "Hay canciones que terminan convirtiéndose en recuerdos. Esta quiero que sea nuestra.",
    sceneTitle: "Nuestro vinilo",
    sceneKicker: "Lado A",
    iosVolumeNote: "En iPhone, el volumen se maneja con los botones del costado.",
    fallbackNote: "Si la música no arranca, tocá directamente el video."
  },

  /* ---------- Escena 3 · Ocho meses, una historia ---------- */
  // "art" elige la ilustración: calendar | map | constellation | stamps
  story: {
    sceneTitle: "Ocho meses, una historia",
    moments: [
      { date: "16 de marzo de 2026", title: "El comienzo de nuestra historia",
        text: "Un día cualquiera que terminó siendo el primero de todos.", art: "calendar" },
      { date: "16 de julio", title: "Un nuevo capítulo",
        text: "Aprendimos a encontrarnos, incluso con un mapa entero de por medio.", art: "map" },
      { date: "16 de septiembre", title: "Seis meses de nosotros",
        text: "Medio año eligiéndonos, una estrella por cada mes.", art: "constellation" },
      { date: "16 de noviembre", title: "Ocho meses juntos",
        text: "Y las mismas ganas de seguir escribiéndonos.", art: "stamps" }
    ]
  },

  /* ---------- Escena 4 · Dos lugares, un sentimiento ---------- */
  distance: {
    sceneTitle: "Dos lugares, un sentimiento",
    placeA: "Argentina",
    placeB: "México",
    text: "Hay kilómetros entre nosotros, pero hay cosas que no necesitan estar cerca para sentirse.",
    button: "Acercarnos"
  },

  /* ---------- Escena 5 · La carta ---------- */
  letter: {
    title: "Para vos, mi amor.",
    // Cada elemento es un párrafo. Editá libremente.
    paragraphs: [
      "Day, amor...",
      "Ocho meses pueden parecer poco tiempo cuando los comparás con toda una vida, pero para mí alcanzaron para llenar de recuerdos, emociones y momentos una historia que quiero seguir construyendo con vos.",
      "No sé qué nos espera en cada capítulo que viene, pero sí sé que quiero seguir descubriéndolo a tu lado.",
      "Gracias por estos ocho meses, por tu cariño, por tu manera de estar y por todo lo que compartimos.",
      "Si volviera al principio, conociendo todo lo que vivimos y también lo que todavía nos queda por vivir, volvería a elegirte.",
      "Te amo, mi gordita.",
      "Con todo mi amor."
    ],
    typingSpeed: 28,   // milisegundos por letra (más bajo = más rápido)
    skipHint: "Tocá la carta para verla completa",
    finalLine: "Y si pudiera volver a empezar, volvería a encontrarte.",
    signature: "Siempre tuyo."
  },

  /* ---------- Navegación ---------- */
  nav: {
    next: "Seguir",
    prev: "Volver",
    restart: "Volver al principio"
  }
};
