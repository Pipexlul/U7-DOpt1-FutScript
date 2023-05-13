import express from "express";

import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import { obtenerJugadores, registrarJugador } from "./controllers/jugadores.js";
import { obtenerEquipos, agregarEquipo } from "./controllers/equipos.js";

app.get("/equipos", obtenerEquipos);
app.post("/equipos", agregarEquipo);

app.get("/equipos/:teamID/jugadores", obtenerJugadores);
app.post("/equipos/:teamID/jugadores", registrarJugador);

app.listen(3000, console.log("SERVER ON"));
