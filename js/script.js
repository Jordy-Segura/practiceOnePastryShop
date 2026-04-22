const INSIGNIA = {
  Alta: { ico: "fa-fire", clase: "alta" },
  Media: { ico: "fa-star", clase: "media" },
  Baja: { ico: "fa-leaf", clase: "baja" },
};

let tareas = [
  { id: 1, nombre: "Hornear pastel de chocolate", prio: "Alta", fecha: "24/05/2026", hecha: false },
  { id: 2, nombre: "Preparar frosting de vainilla", prio: "Alta", fecha: "24/05/2026", hecha: false },
  { id: 3, nombre: "Hacer croissants de mantequilla", prio: "Baja", fecha: "23/05/2026", hecha: true },
  { id: 4, nombre: "Decorar cupcakes de fresa", prio: "Baja", fecha: "25/05/2026", hecha: false },
  { id: 5, nombre: "Comprar harina, azúcar y huevos", prio: "Media", fecha: "23/05/2026", hecha: false },
];

let filtro = "todas";
let sigId = 6;

const $lista = document.getElementById("lista");
const $nom = document.getElementById("inp-tarea");
const $prio = document.getElementById("inp-prio");
const $fec = document.getElementById("inp-fecha");
const $menu = document.getElementById("menu");
const $error = document.getElementById("error");

// Eventos 
document.getElementById("btn-agregar").addEventListener("click", agregar);

document.getElementById("btn-menu").addEventListener("click", () => {
  $menu.style.display = $menu.style.display === "block" ? "none" : "block";
});

document.querySelectorAll("[data-filtro]").forEach(b =>
  b.addEventListener("click", () => {
    ponerFiltro(b.dataset.filtro);
    $menu.style.display = "none";
  })
);

// Lógica de tareas 
function ponerFiltro(val) {
  filtro = val;
  document.querySelectorAll(".filtro, .enlace").forEach(b => b.classList.remove("activo"));
  document.querySelectorAll(`[data-filtro="${val}"]`).forEach(b => b.classList.add("activo"));
  mostrar();
}

function agregar() {
  const nombre = $nom.value.trim();
  if (!nombre) {
    $error.textContent = "Por favor escribe el nombre de la tarea.";
    $nom.focus();
    return;
  }
  $error.textContent = "";
  const fecha = $fec.value ? $fec.value.split("-").reverse().join("/") : "Sin fecha";
  tareas.push({ id: sigId++, nombre, prio: $prio.value, fecha, hecha: false });
  $nom.value = $fec.value = "";
  mostrar();
}

function alternar(id) {
  const t = tareas.find(t => t.id === id);
  if (t) { t.hecha = !t.hecha; mostrar(); }
}

function eliminar(id) {
  tareas = tareas.filter(t => t.id !== id);
  mostrar();
}

// DOM 
function ico(...cls) {
  const i = document.createElement("i");
  i.className = cls.join(" ");
  return i;
}

function boton(clases, titulo, contenido, alClick) {
  const b = document.createElement("button");
  b.className = clases;
  b.title = titulo;
  b.append(contenido);
  b.onclick = alClick;
  return b;
}

// Crear elemento tarea 
function crearTarea(t) {
  const elem = document.createElement("div");
  elem.className = "tarea" + (t.hecha ? " completada" : "");

  const izq = document.createElement("div");
  izq.className = "izq";

  const caja = boton(
    "caja" + (t.hecha ? " marcada" : ""),
    t.hecha ? "Deshacer" : "Completar",
    t.hecha ? ico("fa-solid", "fa-check") : document.createTextNode(""),
    () => alternar(t.id)
  );

  const nom = document.createElement("span");
  nom.className = "nombre" + (t.hecha ? " tachada" : "");
  nom.textContent = t.nombre;

  const { ico: icono, clase } = INSIGNIA[t.prio];
  const ins = document.createElement("span");
  ins.className = `etiqueta ${clase}`;
  ins.append(ico("fa-solid", icono), ` ${t.prio}`);

  izq.append(caja, nom, ins);

  const der = document.createElement("div");
  der.className = "der";

  const fec = document.createElement("span");
  fec.className = "fecha";
  fec.append(ico("fa-solid", "fa-calendar-days"), ` ${t.fecha}`);

  const bCambiar = boton(
    "accion",
    t.hecha ? "Deshacer" : "Completar",
    ico("fa-solid", t.hecha ? "fa-rotate-left" : "fa-check"),
    () => alternar(t.id)
  );

  const bBorrar = boton(
    "accion eliminar",
    "Eliminar",
    ico("fa-solid", "fa-trash"),
    () => eliminar(t.id)
  );

  der.append(fec, bCambiar, bBorrar);
  elem.append(izq, der);
  return elem;
}

// Mostrar lista 
function mostrar() {
  const hechas = tareas.filter(t => t.hecha).length;
  document.getElementById("tot").textContent = tareas.length;
  document.getElementById("pend").textContent = tareas.length - hechas;
  document.getElementById("comp").textContent = hechas;

  $lista.textContent = "";

  const lista = tareas.filter(t =>
    filtro === "pendientes" ? !t.hecha :
      filtro === "completadas" ? t.hecha : true
  );

  if (!lista.length) {
    const p = document.createElement("p");
    p.className = "vacio";
    p.append(ico("fa-solid", "fa-folder-open"), " No hay tareas aquí. ¡Agrega una nueva!");
    $lista.appendChild(p);
    return;
  }

  lista.forEach(t => $lista.appendChild(crearTarea(t)));
}

mostrar();