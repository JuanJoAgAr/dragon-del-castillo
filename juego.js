const formulario = document.getElementById("formulario");
const entrada = document.getElementById("entrada");
const chat = document.getElementById("chat");
const dragon = document.getElementById("dragon");
const barraConfianza = document.getElementById("confianza");
const estado = document.getElementById("estado");
const turnosTexto = document.getElementById("turnos");

const MAX_TURNOS = 10;
const META = 100;
let confianza = 30;
let turnos = MAX_TURNOS;
let terminado = false;

function agregarMensaje(texto, clase) {
  const mensaje = document.createElement("p");
  mensaje.className = `msg ${clase}`;
  mensaje.textContent = texto;
  chat.appendChild(mensaje);
  chat.scrollTop = chat.scrollHeight;
}

function actualizarPantalla() {
  confianza = Math.max(0, Math.min(100, confianza));
  barraConfianza.style.width = `${confianza}%`;
  barraConfianza.style.background = confianza >= 70 ? "#42d392" :
    confianza >= 35 ? "#ffb400" : "#ff5c5c";
  estado.textContent = `Confianza: ${confianza} / 100`;
  turnosTexto.textContent = `Turnos restantes: ${turnos} / ${MAX_TURNOS}`;
  dragon.classList.toggle("feliz", confianza >= 60);
  dragon.classList.toggle("enojado", confianza < 25);
  entrada.disabled = terminado;
  formulario.querySelector("button").disabled = terminado;
}

function terminar(victoria) {
  terminado = true;
  agregarMensaje(victoria
    ? "¡Lo lograste! lucumi confía en ti y te entrega la llave del castillo. 🗝️"
    : "El dragón perdió la paciencia. No conseguiste la llave. ¡Inténtalo otra vez!",
    "dragon-msg");
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "reiniciar";
  boton.textContent = "Jugar de nuevo";
  boton.addEventListener("click", reiniciarJuego);
  chat.appendChild(boton);
  actualizarPantalla();
}

function reiniciarJuego() {
  confianza = 30;
  turnos = MAX_TURNOS;
  terminado = false;
  chat.replaceChildren();
  agregarMensaje("¡Hola! Soy lucumi, guardián de este castillo. Si quieres la llave, tendrás que ganarte mi confianza.", "dragon-msg");
  entrada.value = "";
  actualizarPantalla();
  entrada.focus();
}

formulario.addEventListener("submit", evento => {
  evento.preventDefault();
  if (terminado) return;
  const texto = entrada.value.trim();
  if (!texto) return;

  agregarMensaje(texto, "jugador");
  const sentimiento = analizarSentimiento(texto);
  const intencion = detectarIntencion(texto);
  const cambio = Math.max(-25, Math.min(25, sentimiento * 6));
  confianza = Math.max(0, Math.min(100, confianza + cambio));
  turnos--;

  const humor = sentimiento >= 0 && confianza >= 25 ? "bien" : "mal";
  agregarMensaje(RESPUESTAS[intencion][humor], "dragon-msg");
  entrada.value = "";
  actualizarPantalla();

  if (confianza >= META) terminar(true);
  else if (confianza <= 0 || turnos <= 0) terminar(false);
  else entrada.focus();
});

agregarMensaje("¡Hola! Soy lucumi, guardián de este castillo. Si quieres la llave, tendrás que ganarte mi confianza.", "dragon-msg");
actualizarPantalla();
