import jwt from "jsonwebtoken";
const { verify } = jwt;

import { envConfig } from "../../utils/envUtils.js";

const validateAuth =
  ({ checkAdmin = false }) =>
  (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      res.status(401).json({ error: "No se encontró token de autenticación" });
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const { username, admin } = verify(token, envConfig.jwtSecret);

      if (checkAdmin && !admin) {
        res.status(403).json({
          error: "No tienes permisos suficientes para utilizar esta ruta",
        });
        return;
      }

      console.log(
        `User ${username} successfully accessed route as ${
          admin ? "admin" : "user"
        }`
      );

      next();
    } catch (err) {
      res.status(401).json({ error: "El token no es válido" });
      return;
    }
  };

export default validateAuth;
