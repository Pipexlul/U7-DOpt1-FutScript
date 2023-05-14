import getDbQueries from "../db/consultas.js";
const { getPlayers, addPlayer } = getDbQueries();

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

export { obtenerJugadores, registrarJugador };
