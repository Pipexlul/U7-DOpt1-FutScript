import pg from "pg";
const { Pool } = pg;

import pgFormat from "pg-format";
import bcrypt from "bcryptjs";

import { envConfig, dbConfig, options } from "../utils/envUtils.js";

const tabNames = {
  equipos: "equipos",
  posiciones: "posiciones",
  jugadores: "jugadores",
};

const rootPool = new Pool({
  ...dbConfig,
  database: "postgres",
  allowExitOnIdle: true,
});

const initDatabase = async () => {
  const testAccounts = [
    {
      username: "admin",
      password: "1234",
      admin: true,
    },
    {
      username: "user",
      password: "abcd",
      admin: false,
    },
  ];

  try {
    const accountCreationQueries = [];

    for (const account of testAccounts) {
      const salt = bcrypt.genSaltSync(envConfig.saltRounds);
      account.password = bcrypt.hashSync(account.password, salt);

      accountCreationQueries.push(
        pgFormat(
          "INSERT INTO users (username, password, admin) VALUES (%L, %L, %L);",
          account.username,
          account.password,
          account.admin
        )
      );
    }

    const fullDeleteQueries = [
      pgFormat("DROP DATABASE IF EXISTS %s", dbConfig.database),
    ];

    if (options.fullDelete) {
      for (const query of fullDeleteQueries) {
        await rootPool.query(query);
      }

      console.log("Fully deleted database (if existed)");
    }

    const insertQueries = [
      "INSERT INTO posiciones (name) VALUES ('delantero'), ('centrocampista'), ('defensa'), ('portero');",
      ...accountCreationQueries,
    ];

    const newTableQueries = [
      "CREATE TABLE IF NOT EXISTS equipos (id SERIAL PRIMARY KEY, name VARCHAR(250) NOT NULL);",
      "CREATE TABLE IF NOT EXISTS posiciones (id SERIAL PRIMARY KEY, name VARCHAR(250) NOT NULL);",
      "CREATE TABLE IF NOT EXISTS jugadores (id SERIAL PRIMARY KEY, id_equipo INT REFERENCES equipos(id), name VARCHAR(250), position INT REFERENCES posiciones(id));",
      "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(60) UNIQUE NOT NULL, password VARCHAR(72) NOT NULL, admin BOOLEAN DEFAULT false);",
    ];

    const cleanTableQueries = [
      "TRUNCATE equipos, posiciones, jugadores RESTART IDENTITY CASCADE;",
    ];

    const checkDatabaseQuery = pgFormat(
      "SELECT datname FROM pg_catalog.pg_database WHERE datname = %L;",
      dbConfig.database
    );

    const result = await rootPool.query(checkDatabaseQuery);
    if (result.rows.length === 0) {
      const createDatabaseQuery = pgFormat(
        "CREATE DATABASE %s;",
        dbConfig.database
      );
      await rootPool.query(createDatabaseQuery);
      console.log("Database created");

      pool = new Pool({
        ...dbConfig,
        allowExitOnIdle: true,
      });

      for (const query of newTableQueries) {
        await pool.query(query);
      }

      console.log("Created database and tables");
    } else {
      pool = new Pool({
        ...dbConfig,
        allowExitOnIdle: true,
      });

      if (!options.skip) {
        for (const query of cleanTableQueries) {
          await pool.query(query);
        }

        console.log("Cleaned tables");
      } else {
        console.log("Skipped table cleaning");
      }
    }

    const shouldInsertStarterData = !options.skip || options.fullDelete;

    if (shouldInsertStarterData) {
      for (const query of insertQueries) {
        await pool.query(query);
      }

      console.log("Inserted starter data");
    }
  } catch (err) {
    console.error(err);
    console.error("Failed to initialize database");
    process.exit(1);
  }
};

let pool;

const getTeams = async () => {
  try {
    const query = pgFormat("SELECT * FROM %s", tabNames.equipos);
    const result = await pool.query(query);

    return result.rows;
  } catch (err) {
    console.error(err);
    return new Error("Failed to get teams");
  }
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

const getUserData = async (username) => {
  try {
    const query = pgFormat(
      "SELECT password FROM users WHERE username = %L;",
      username
    );

    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];

    return {
      password: user.password,
      admin: user.admin,
    };
  } catch (err) {
    console.error(err);
    return new Error(`Failed to get user data for ${username}`);
  }
};

let didInit = false;

export default () => {
  if (!didInit) {
    initDatabase();
    didInit = true;
  }

  return {
    getTeams,
    getPlayers,
    addTeam,
    addPlayer,
    getUserData,
  };
};
