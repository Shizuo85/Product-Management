import request from "supertest";
import app from "../../app";

describe("POST /auth/login", () => {
    it("should login a registered user", async () => {
        const response = await request(app).post("/api/v1/auth/login").send({
            email: process.env.TEST_USER,
            password: process.env.TEST_PASSWORD,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body).toHaveProperty("message");
    });

    it("should not login a registered user with an invalid password", async () => {
        const response = await request(app).post("/api/v1/auth/login").send({
            email: process.env.TEST_USER,
            password: "wrongPassword",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Incorrect Email or Password"
        );
    });

    it("should not login an unregistered user", async () => {
        const response = await request(app).post("/api/v1/auth/login").send({
            email: "wrongemail@gmail.com",
            password: "newPassword_44",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "This account does not exist"
        );
    });

    it("should throw an error for an invalid input format", async () => {
        const response = await request(app).post("/api/v1/auth/login").send({
            email: "invalid email address",
            password: "wrongPassword",
        });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty(
            "error",
            `\"email\" must be a valid email`
        );
    });

});


