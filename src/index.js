import express from "express";

import cors from "cors";

import getDbQueries, { initDatabase } from "./db/consultas.js";

const app = express();
app.use(cors());
app.use(express.json());

import validators from "./middleware/validators/routes.js";

import jugadoresRoutes from "./controllers/jugadores.js";
const { obtenerJugadores, registrarJugador } = jugadoresRoutes;

import equiposRoutes from "./controllers/equipos.js";
const { obtenerEquipos, obtenerEquipo, agregarEquipo } = equiposRoutes;

import loginRoutes from "./controllers/login.js";
const { loginUser } = loginRoutes;

app.post("/login", validators.postLogin, loginUser);

app.get("/equipos", obtenerEquipos);
app.post(
  "/equipos",
  validators.postEquipos({ checkAdmin: true }),
  agregarEquipo
);

app.get("/equipos/:teamID", validators.getTeam, obtenerEquipo);

app.get(
  "/equipos/:teamID/jugadores",
  validators.getJugadores,
  obtenerJugadores
);
app.post(
  "/equipos/:teamID/jugadores",
  validators.postJugadores({ checkAdmin: true }),
  registrarJugador
);

if (process.env.NODE_ENV !== "development") {
  initDatabase().then(() => {
    app.listen(3000, console.log("SERVER ON"));
  });
} else {
  app.listen(3000, console.log("SERVER ON"));
}

export { app, initDatabase, getDbQueries };
