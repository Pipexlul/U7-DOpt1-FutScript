import getDBQueries from "../db/consultas.js";
const { getTeams, addTeam } = getDBQueries();

import asyncLoader from "../middleware/asyncMiddleware.js";

const obtenerEquipos = async (req, res) => {
  const equipos = await getTeams();
  res.json(equipos);
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
