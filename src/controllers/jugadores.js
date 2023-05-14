import getDbQueries from "../db/consultas.js";
const { getPlayers, addPlayer } = getDbQueries();

import asyncLoader from "../middleware/asyncMiddleware.js";

const obtenerJugadores = async (req, res) => {
  const { teamID } = req.params;
  const jugadores = await getPlayers(teamID);
  res.json(jugadores);
};

const registrarJugador = async (req, res) => {
  const { teamID } = req.params;
  const jugador = req.body;
  await addPlayer({ jugador, teamID });
  res.json({ message: "Jugador agregado con éxito" });
};

export default {
  obtenerJugadores: asyncLoader(obtenerJugadores),
  registrarJugador: asyncLoader(registrarJugador),
};
