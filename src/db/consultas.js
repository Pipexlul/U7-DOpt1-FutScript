import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "futscript",
  allowExitOnIdle: true,
});

const getTeams = async () => {
  //...
};

const getPlayers = async (teamID) => {
  //...
};

const addTeam = async (equipo) => {
  //...
};

const addPlayer = async ({ jugador, teamID }) => {
  //...
};

export default { getTeams, addTeam, getPlayers, addPlayer };
