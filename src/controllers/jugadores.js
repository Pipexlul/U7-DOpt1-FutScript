import getDbQueries from "../db/consultas.js";
const { getPlayers, addPlayer } = getDbQueries();

import asyncLoader from "../middleware/asyncMiddleware.js";

const obtenerJugadores = async (req, res) => {
  const { teamID } = req.params;
  const result = await getPlayers(teamID);

  if (result === null) {
    res.status(404).json({ error: `Equipo de id ${teamID} no encontrado` });
    return;
  }

  if (result instanceof Error) {
    res
      .status(500)
      .json({ error: `Server error when fetching players of team ${teamID}` });
    return;
  }

  const players = result.map((player) => ({
    name: player.player_name,
    posicion: player.position_name,
  }));

  res.status(200).json(players);
};

const registrarJugador = async (req, res) => {
  const { teamID } = req.params;
  const jugador = req.body;

  try {
    const result = await addPlayer({ jugador, teamID });
    if (result === null) {
      res.status(404).json({ error: `Equipo de id ${teamID} no encontrado` });
      return;
    }

    res.status(201).json({ message: "Jugador agregado con exito" });
  } catch (err) {
    if (err && err.code === "23505") {
      res.status(409).json({ error: "El jugador ya existe" });
      return;
    }
    res.status(500).json({ error: "Error al intentar añadir jugador" });
  }
};

export default {
  obtenerJugadores: asyncLoader(obtenerJugadores),
  registrarJugador: asyncLoader(registrarJugador),
};
