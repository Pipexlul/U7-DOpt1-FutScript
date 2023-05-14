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
  agregarEquipo: asyncLoader(agregarEquipo),
};
