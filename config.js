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
    hint: "Solo uno es para vos. ¿Cuál será?",
    correctLabel: "para Day",
    // Sobres "trampa": lo que dice cada uno
    decoyLabels: ["para Saturno", "para la luna", "no abrir", "para el futuro", "abrir en 2027", "para nadie", "casi para vos", "para mí"],
    // Lo que aparece cuando toca uno equivocado
    wrongMessages: ["este no, amor", "frío, frío…", "casi…", "seguí buscando", "mmm, no", "ni cerca", "otro intento"],
    clue: "Pista: buscá el que dice tu nombre.",
    clueAfter: 3,          // después de cuántos intentos aparece la pista
    decoysPhone: 7,        // cantidad de sobres trampa en el celular
    decoysTablet: 8,       // y en iPad / pantallas grandes
    cardTitle: "Ocho meses y todavía te elegiría",
    cardDate: "16 · XI · 2026",
    button: "Abrir nuestro pequeño mundo"
  },

  /* ---------- Escena 2 · Nuestro vinilo ---------- */
  music: {
    youtubeId: "5Ipg_Aof1SM",          // https://www.youtube.com/watch?v=5Ipg_Aof1SM
    title: "Saturno",
    artist: "Pablo Alborán",
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
    title: "Para mi gordita.",
    // Cada elemento es un párrafo. Editá libremente.
    paragraphs: [
      "Mi amor:",
      "Hoy cumplimos ocho meses. Ocho meses desde aquel 16 de marzo en el que comenzó esta historia que, de alguna manera, terminó convirtiéndose en una parte tan importante de mi vida.",
      "A veces me pongo a pensar en todo lo que pasó desde entonces y me resulta increíble la cantidad de cosas que podemos llegar a compartir con alguien incluso cuando no tenemos la posibilidad de estar físicamente cerca. Porque vos y yo sabemos que lo nuestro no siempre fue sencillo. Tuvimos días hermosos, otros bastante difíciles, momentos en los que nos entendimos perfectamente y otros en los que nos costó muchísimo encontrarnos. Pero acá estamos, todavía eligiéndonos y aprendiendo a querernos un poquito mejor.",
      "Si algo me enseñaron estos meses es que amar a alguien no significa solamente disfrutar de los momentos lindos. También significa aprender a escuchar, reconocer errores, tener paciencia y entender que enfrente no tenemos a alguien contra quien luchar, sino a alguien con quien queremos construir.",
      "Y si hay algo que quiero seguir construyendo, es una vida con vos.",
      "Me encanta nuestra cotidianidad, incluso esa que hoy tenemos que vivir a través de una pantalla. Me gusta saber cómo estuvo tu día, escuchar tus historias, contarte las mías, ver nuestras series, compartir comidas, hacer planes y hasta esos momentos en los que no tenemos demasiado para decir, pero igualmente queremos estar juntos. Quizás algún día estas cosas parezcan insignificantes, pero estoy seguro de que voy a extrañarlas si alguna vez pienso en cómo empezó todo.",
      "Hay algo que me emociona especialmente y es pensar en todas las primeras veces que todavía nos esperan. La primera vez que podamos abrazarnos sin tener que despedirnos mirando el reloj, despertarnos juntos, salir a caminar sin pensar en la diferencia horaria, cocinar algo, compartir una cena y descubrir cómo es nuestra vida cuando la distancia deja de ser parte de nuestra rutina.",
      "No quiero idealizar nuestro futuro ni prometerte que todo será perfecto. Quiero algo mucho más real que eso. Quiero que podamos construir una vida en la que haya espacio para nuestros sueños, nuestras diferencias, nuestros días buenos y también los complicados. Quiero acompañarte, conocer cada vez más de vos y que nunca sientas que tenés que enfrentar sola las cosas que te preocupan.",
      "También quiero que sigamos enamorándonos de las pequeñas cosas. Que no perdamos las ganas de sorprendernos, de escribirnos, de buscarnos y de recordarnos por qué nos elegimos. No quiero que los meses se conviertan simplemente en números que vamos sumando, sino en recuerdos que podamos mirar algún día y decir que valió la pena cada esfuerzo.",
      "Mi gordita, no sé exactamente cómo será cada capítulo que viene, pero sí sé con quién quiero compartirlo. Y eso para mí significa muchísimo.",
      "Gracias por llegar a mi vida, por compartir tus días conmigo, por dejarme conocer tus sueños, tus miedos, tus ocurrencias y todas esas pequeñas partes de vos que hacen que seas la persona que amo.",
      "Hoy no solamente celebro nuestros ocho meses. Celebro que todavía tengamos ganas, que todavía nos ilusionemos y que sigamos imaginando un futuro en el que ya no tengamos que extrañarnos.",
      "Ocho meses después, volvería a elegirte. Y si pudiera adelantarme en el tiempo, me gustaría encontrarme con nosotros dos, mirando hacia atrás, abrazados y sabiendo que finalmente lo conseguimos.",
      "Te amo muchísimo, mi vida.",
      "Feliz octavo mes, mi gordita.",
      "Con todo mi amor,",
      "Tu gordito. ❤️"
    ],
    // cuántos renglones del final van alineados a la derecha (la despedida)
    signOffLines: 4,
    typingSpeed: 14,   // milisegundos por letra (más bajo = más rápido)
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
