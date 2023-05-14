import express from "express";

import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import validators from "./middleware/validators/routes.js";

import jugadoresRoutes from "./controllers/jugadores.js";
const { obtenerJugadores, registrarJugador } = jugadoresRoutes;

import equiposRoutes from "./controllers/equipos.js";
const { obtenerEquipos, agregarEquipo } = equiposRoutes;

import loginRoutes from "./controllers/login.js";
const { loginUser } = loginRoutes;

app.post("/login", validators.postLogin, loginUser);

app.get("/equipos", obtenerEquipos);
app.post(
  "/equipos",
  validators.postEquipos({ checkAdmin: true }),
  agregarEquipo
);

app.get("/equipos/:teamID/jugadores", obtenerJugadores);
app.post("/equipos/:teamID/jugadores", registrarJugador);

app.listen(3000, console.log("SERVER ON"));
