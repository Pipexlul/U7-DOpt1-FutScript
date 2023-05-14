import express from "express";

import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import jugadoresRoutes from "./controllers/jugadores.js";
const { obtenerJugadores, registrarJugador } = jugadoresRoutes;

import equiposRoutes from "./controllers/equipos.js";
const { obtenerEquipos, agregarEquipo } = equiposRoutes;

app.get("/equipos", obtenerEquipos);
app.post("/equipos", agregarEquipo);

app.get("/equipos/:teamID/jugadores", obtenerJugadores);
app.post("/equipos/:teamID/jugadores", registrarJugador);

app.listen(3000, console.log("SERVER ON"));
