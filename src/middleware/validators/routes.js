import validateLoginBody from "../body/loginBody.js";
import validateTeamBody from "../body/teamBody.js";
import validateAuth from "../authorization/jwt.js";

const postLogin = [validateLoginBody];
const postEquipos = ({ checkAdmin = false }) => [
  validateAuth({ checkAdmin }),
  validateTeamBody,
];

const postJugadores = ({ checkAdmin = false }) => [
  validateAuth({ checkAdmin }),
];

export default {
  postLogin,
  postEquipos,
  postJugadores,
};
