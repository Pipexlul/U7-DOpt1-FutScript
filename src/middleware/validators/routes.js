import validateLoginBody from "../body/loginBody.js";
import validateAuth from "../authorization/jwt.js";

const postLogin = [validateLoginBody];
const postEquipos = ({ checkAdmin = false }) => [validateAuth({ checkAdmin })];

export default {
  postLogin,
  postEquipos,
};
