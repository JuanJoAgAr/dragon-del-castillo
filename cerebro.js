const LEXICO = {
  // Palabras positivas
  gracias: 2, hermoso: 3, genial: 3, poderoso: 3, amigo: 2,
  admiro: 3, valiente: 2, lindo: 2, papi: 2, amable: 3,
  respeto: 3, excelente: 3, querido: 2, increible: 3,
  maravilloso: 3, agradable: 2, carismatico: 1, grande: 1,
  heroico: 2, papi: 2, chimba: 2, 
  // Palabras negativas
  feo: -3, tonto: -3, idiota: -4, odio: -4, cobarde: -3,
  basura: -4, hijueputa: -4, carechimba: -3, aguevado: -3,
  dragoncito: -1, estupido: -4, horrible: -3, malo: -2, caremonda: -2, perra: -1,
  zunga: -2, dislexico: -2, anormal: -2, especial: -3, chiquitin: -1,
  lerdo: -1, atontado: -2, subnormal: -3, pirobo: -2, chimbo: -2
};

function normalizar(texto) {
  return String(texto).toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñ\s]/g, " ").trim();
}

const NEGADORES = ["no", "nunca", "jamas", "tampoco"];

function analizarSentimiento(texto) {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  let puntaje = 0;
  palabras.forEach((palabra, i) => {
    let valor = LEXICO[palabra] || 0;
    if (valor !== 0 && (NEGADORES.includes(palabras[i - 1]) ||
        NEGADORES.includes(palabras[i - 2]))) valor = -valor;
    puntaje += valor;
  });
  if (String(texto).includes("!") && puntaje < 0) puntaje -= 1;
  return puntaje;
}

const INTENCIONES = [
  { nombre: "saludo", claves: ["hola", "buenas", "saludos", "hey"] },
  { nombre: "llave", claves: ["llave", "puerta", "abrir", "tesoro"] },
  { nombre: "nombre", claves: ["nombre", "llamas", "quien"] },
  { nombre: "chiste", claves: ["chiste", "gracioso", "risa", "broma"] },
  { nombre: "comida", claves: ["comida", "hambre", "comer", "oveja"] },
  { nombre: "despedida", claves: ["adios", "chao", "bye", "hasta"] },
  { nombre: "bienestar", claves: ["esta", "estas", "le ha ido", "como va"] }
];

function detectarIntencion(texto) {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  for (const intencion of INTENCIONES) {
    if (intencion.claves.some(clave => palabras.includes(clave))) return intencion.nombre;
  }
  return "desconocida";
}

const RESPUESTAS = {
  saludo: {
    bien: "¡Saludos, viajero! Hacía siglos que nadie me hablaba con respeto.",
    mal: "Grrr... ¿Qué quieres, pequeño humano bobo?"
  },
  llave: {
    bien: "¿La llave? Me caes bien... pero demuéstrame que eres uno de los buenos de los leales.",
    mal: "¡La llave es MÍA! Vuelve cuando aprendas modales grosero hp."
  },
  nombre: {
    bien: "Me llaman lucumi el Paciente. ¿Y tú?",
    mal: "Mi nombre es «DESPEGUELA DE AQUI»."
  },
  chiste: {
    bien: "¿Por qué el dragón no usa WiFi? ¡Porque quema la conexión! Ja, ja.",
    mal: "No estoy de humor para chistes. Tu cara ya es suficiente broma."
  },
  comida: {
    bien: "Mmm, empanada.....  Hace tiempo que no como bien. ¡esta una rechimba!",
    mal: "¿Comida? Estoy pensando en comerte A TI si sigue con la guevonada mijo."
  },
  despedida: {
    bien: "Vuelve pronto, viajero. su energia es una chimba mi so.",
    mal: "¡Largo de aquí prb si no quiere q le pregunte si su mama sabe cocer!"
  },
  desconocida: {
    bien: "No entendí del todo, pero me gusta tu manera de hablar. Cuéntame algo más.",
    mal: "No entiendo lo que dices. Y no me gusta tu tono."
  },
   bienestar: {
    bien: "bien parcerito aqui camellandola para proteger esta lleve y usted papi.",
    mal: "cueles bobo deje de hacer preguntas y diga que quiere"
  }
};
