import getDBQueries from "../db/consultas.js";
const { getTeams, getTeam, addTeam } = getDBQueries();

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

const obtenerEquipo = async (req, res) => {
  const { teamID } = req.params;
  const result = await getTeam(teamID);

  if (result === null) {
    res.status(404).json({ error: "Team not found" });
    return;
  }

  if (result instanceof Error) {
    res.status(500).json({ error: "Server error when fetching team" });
    return;
  }

  res.status(200).json(result);
};

const agregarEquipo = async (req, res) => {
  const equipo = req.body;

  try {
    await addTeam(equipo);
    res.status(201).json({ message: "Equipo agregado con éxito" });
  } catch (err) {
    if (err && err.code === "23505") {
      res.status(409).json({ error: "El equipo ya existe" });
      return;
    }
    res.status(500).json({ error: "Error al intentar añadir equipo" });
  }
};

export default {
  obtenerEquipos: asyncLoader(obtenerEquipos),
  obtenerEquipo: asyncLoader(obtenerEquipo),
  agregarEquipo: asyncLoader(agregarEquipo),
};
