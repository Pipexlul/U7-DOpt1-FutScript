import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";

import { app as server, initDatabase, getDbQueries } from "../src/index.js";

const app = request(server);

let adminToken;
let userToken;

const setTestData = async () => {
  await initDatabase();

  const { addTeam, addPlayer } = getDbQueries();

  const teamNames = [
    "Barcelona",
    "Real Madrid",
    "Renca Juniors",
    "Valencia",
    "Sevilla",
  ];
  const playersData = [
    {
      name: "Juan",
      position: 1,
      team: 1,
    },
    {
      name: "Pedro",
      position: 2,
      team: 1,
    },
    {
      name: "Pablo",
      position: 3,
      team: 1,
    },
    {
      name: "Gonzalo",
      position: 4,
      team: 1,
    },
    {
      name: "Rigoberto",
      position: 2,
      team: 2,
    },
    {
      name: "Garrus",
      position: 2,
      team: 2,
    },
  ];

  for (const teamName of teamNames) {
    await addTeam({ name: teamName });
  }

  for (const playerData of playersData) {
    const dataToSend = {
      name: playerData.name,
      position: playerData.position,
    };

    await addPlayer({ jugador: dataToSend, teamID: playerData.team });
  }

  let tokenRes = await app.post("/login").send({
    username: "admin",
    password: "1234",
  });

  adminToken = tokenRes.body.token;

  tokenRes = await app.post("/login").send({
    username: "user",
    password: "abcd",
  });

  userToken = tokenRes.body.token;
};

beforeAll(() => {
  return setTestData();
});

describe("Check /login routes", () => {
  it("Should return an object and status code 200 on valid credentials", async () => {
    const response = await app.post("/login").send({
      username: "admin",
      password: "1234",
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("Should return an object and status code 400 on invalid credentials", async () => {
    const response = await app.post("/login").send({
      username: "admin",
      password: "epicPass",
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("Check /equipos routes", () => {
  describe("GET requests", () => {
    it("Should return an array and status code 200", async () => {
      const response = await app.get("/equipos").send();

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST requests", () => {
    it("Should return status code 201 on valid credentials with admin permission and request body", async () => {
      const response = await app
        .post("/equipos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Deportes Cerrillos FC",
        });

      expect(response.status).toBe(201);
    });

    it("Should return status code 400 on invalid credentials", async () => {
      const response = await app
        .post("/equipos")
        .set("Authorization", `Bearer EpicToken`)
        .send({
          name: "Deportes Maipu FC",
        });

      expect(response.status).toBe(400);
    });

    it("Should return status code 400 on invalid request body", async () => {
      const response = await app
        .post("/equipos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          epicProperty: "Deportes Maipu FC",
        });

      expect(response.status).toBe(400);
    });

    it("Should return status code 403 on valid credentials but without admin permission", async () => {
      const response = await app
        .post("/equipos")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Deportes Maipu FC",
        });

      expect(response.status).toBe(403);
    });

    it("Should return status code 409 on valid credentials with admin permission but with existing team name in body", async () => {
      const response = await app
        .post("/equipos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Deportes Cerrillos FC",
        });

      expect(response.status).toBe(409);
    });
  });
});

describe("Check /equipos/:teamID routes", () => {
  describe("GET requests", () => {
    it("Should return an object and status code 200 if team exists", async () => {
      const response = await app.get("/equipos/1").send();

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });

    it("Should return status code 404 if team does not exist", async () => {
      const response = await app.get("/equipos/999").send();

      expect(response.status).toBe(404);
    });
  });
});

describe("Check /equipos/:teamID/jugadores routes", () => {
  describe("GET requests", () => {
    it("Should return an array and status code 200 if team exists", async () => {
      const response = await app.get("/equipos/1/jugadores").send();

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("Should return status code 404 if team does not exist", async () => {
      const response = await app.get("/equipos/999/jugadores").send();

      expect(response.status).toBe(404);
    });
  });

  describe("POST requests", () => {
    it("Should return status code 201 on valid credentials with admin permission and request body", async () => {
      const response = await app
        .post("/equipos/1/jugadores")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "El mas pro",
          position: 2,
        });

      expect(response.status).toBe(201);
    });

    it("Should return status code 400 on invalid credentials", async () => {
      const response = await app
        .post("/equipos/1/jugadores")
        .set("Authorization", `Bearer EpicToken`)
        .send({
          name: "El mas pro bien bueno",
          position: 2,
        });

      expect(response.status).toBe(400);
    });

    it("Should return status code 403 on valid credentials but without admin permission", async () => {
      const response = await app
        .post("/equipos/1/jugadores")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "El mas pro bien bueno",
          position: 2,
        });

      expect(response.status).toBe(403);
    });

    it("Should return status code 400 on invalid request body", async () => {
      const response = await app
        .post("/equipos/1/jugadores")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          epicProperty: "El mas pro bien bueno",
          position: 2,
        });

      expect(response.status).toBe(400);
    });
  });
});
