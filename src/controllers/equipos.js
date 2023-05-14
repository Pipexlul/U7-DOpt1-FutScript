import getDBQueries from "../db/consultas.js";
const { getTeams, addTeam } = getDBQueries();

import asyncLoader from "../middleware/asyncMiddleware.js";

const obtenerEquipos = async (req, res) => {
  const result = await getTeams();
  if (result instanceof Error) {
    res.status(500).json({ error: "Server error when fetching teams" });
    return;
  }

  const equipos = result.map((equipo) => ({
    id: equipo.id,
    name: equipo.name,
  }));

  res.status(200).json(equipos);
};

const agregarEquipo = async (req, res) => {
  const equipo = req.body;
  await addTeam(equipo);
  res.send({ message: "Equipo agregado con éxito" });
};

export default {
  obtenerEquipos: asyncLoader(obtenerEquipos),
  agregarEquipo: asyncLoader(agregarEquipo),
};
