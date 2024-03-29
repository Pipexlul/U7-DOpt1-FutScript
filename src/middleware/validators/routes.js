import validateLoginBody from "../body/loginBody.js";
import validateTeamBody from "../body/teamBody.js";
import validatePlayerBody from "../body/playerBody.js";
import validateTeamId from "../params/teamId.js";
import validateAuth from "../authorization/jwt.js";

const postLogin = [validateLoginBody];
const postEquipos = ({ checkAdmin = false }) => [
  validateAuth({ checkAdmin }),
  validateTeamBody,
];

const postJugadores = ({ checkAdmin = false }) => [
  validateAuth({ checkAdmin }),
  validatePlayerBody,
];

const getTeam = [validateTeamId];

const getJugadores = [validateTeamId];

export default {
  postLogin,
  postEquipos,
  postJugadores,
  getTeam,
  getJugadores,
};
