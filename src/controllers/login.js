import getDbQueries from "../db/consultas.js";
const { getUserData } = getDbQueries();

import asyncLoader from "../middleware/asyncMiddleware.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { sign } = jwt;

import { envConfig } from "../utils/envUtils.js";

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const userData = await getUserData(username);
  if (userData === null) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  if (userData instanceof Error) {
    res.status(500).json({ error: "Server error when fetching user data" });
    return;
  }

  const isValid = bcrypt.compareSync(password, userData.password);
  if (!isValid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = sign({ username, admin: userData.admin }, envConfig.jwtSecret, {
    expiresIn: 60 * 60 * 1, // 1 hour
  });

  res.status(200).json({ token });
};

export default {
  loginUser: asyncLoader(loginUser),
};
