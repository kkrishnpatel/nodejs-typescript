import request from "supertest";
import { expect } from "chai";
import createServer from "../server";
import { createConnection } from "typeorm";
const app = createServer();
const fakeEmail = () => {
  return `${Math.random().toString(36).slice(2, 7)}@test.com`;
};

let UserToken = "";
let adminToken = "";
let name = "krishn Patel";
let email = fakeEmail();
let password = "12345678";
let role = ["USER", "ADMIN"];
let connection: any = "";
describe("User tests", () => {
  before(async () => {
    connection = await createConnection();
  });

  it("Register user fail test without all params", (done) => {
    request(app)
      .post("/api/register")
      .send({})
      .end((err, res: any) => {
        const message = res.body.errors[0].message;
        expect(res.status).to.be.equal(400);
        expect(message).to.be.equal("Name is required");
        done();
      });
  });

  it("Register user", (done) => {
    request(app)
      .post("/api/register")
      .send({
        name,
        email,
        password,
        role: role[0],
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body.email).equal(email);
        done();
      });
  });
  it("Register user with same email", (done) => {
    request(app)
      .post("/api/register")
      .send({
        name,
        email,
        password,
        role: role[0],
      })
      .end((err, res: any) => {
        expect(res.status).to.be.equal(409);
        done();
      });
  });
  it("Try to login with wrong credential ", (done) => {
    request(app)
      .post("/api/login")
      .send({
        email,
        password: "wrong credential",
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it("Login user", (done) => {
    request(app)
      .post("/api/login")
      .send({
        email,
        password,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.token).to.be.a("string");
        UserToken = res.body.token;
        done();
      });
  });

  it("Try to get user with wrong token", (done) => {
    request(app)
      .get("/api/user")
      .set({ access_token: UserToken+'1' })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        done();
      });
  });
  it("Get user", (done) => {
    request(app)
      .get("/api/user")
      .set({ access_token: UserToken })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        let user = res.body;
        expect(user.name).to.be.equal(name);
        expect(user.email).to.be.equal(email);
        done();
      });
  });
  it("Update password", (done) => {
    request(app)
      .patch("/api/user/password")
      .set({ access_token: UserToken })
      .send({
        password: "87654321",
        passwordConfirm: "87654321",
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        let user = res.body;
        expect(user.name).to.be.equal(name);
        expect(user.email).to.be.equal(email);
        done();
      });
  });
  it("Update profile", (done) => {
    request(app)
      .put("/api/user/info")
      .set({ access_token: UserToken })
      .send({
        email: `new${email}`,
        name: "new example",
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.email).equal(`new${email}`);
        done();
      });
  });
});

describe("Admin tests", () => {
  email = fakeEmail();
  let userId = 0;
  it("Register admin user", (done) => {
    request(app)
      .post("/api/register")
      .send({
        name,
        email,
        password,
        role: role[1],
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body.email).equal(email);
        done();
      });
  });
  it("Login admin", (done) => {
    request(app)
      .post("/api/login")
      .send({
        email,
        password,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.token).to.be.a("string");
        adminToken = res.body.token;
        done();
      });
  });
  it("Try to get all user with USER level access fail", (done) => {
    request(app)
      .get("/api/users")
      .set({ access_token: UserToken })
      .end((err, res) => {
        expect(res.status).to.be.equal(403);
        done();
      });
  });
  it("Try to all User with ADMIN level access", (done) => {
    request(app)
      .get("/api/users")
      .set({ access_token: adminToken })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it("Create user", (done) => {
    request(app)
      .post("/api/users")
      .set({ access_token: adminToken })
      .send({
        name,
        email: `user${email}`,
        role: role[0],
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body.email).equal(`user${email}`);
        userId = res.body.id;
        done();
      });
  });
  it("Get user by id", (done) => {
    request(app)
      .get(`/api/users/${userId}`)
      .set({ access_token: adminToken })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.email).equal(`user${email}`);
        userId = res.body.id;
        done();
      });
  });
  it("Update user by id", (done) => {
    request(app)
      .put(`/api/users/${userId}`)
      .set({ access_token: adminToken })
      .send({
        name: "updated name",
        email: `updated${email}`,
        role: role[0],
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.name).equal("updated name");
        expect(res.body.id).equal(userId);
        done();
      });
  });
  it("Delete user by id using USER role fail", (done) => {
    request(app)
      .delete(`/api/users/${userId}`)
      .set({ access_token: UserToken })
      .end((err, res) => {
        expect(res.status).to.be.equal(403);
        done();
      });
  });
  it("Delete user by id using Admin role", (done) => {
    request(app)
      .delete(`/api/users/${userId}`)
      .set({ access_token: adminToken })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        done();
      });
  });
  after(async () => {
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.clear();
    }
    await connection.close();
  });
});
