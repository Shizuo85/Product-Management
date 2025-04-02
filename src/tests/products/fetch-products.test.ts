import request from "supertest";
import app from "../../app";

describe("GET /product/all", () => {
    it("should not fetch products if jwt is not provided", async () => {
        const response = await request(app)
            .get("/api/v1/product/all");

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "Bad request, token missing"
        );
    });

    it("should not fetch products if wrong but vaild jwt is passed", async () => {
        const response = await request(app)
            .get("/api/v1/product/all")
            .set("Authorization", `Bearer ${process.env.WRONG_TOKEN}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "error",
            "invalid token"
        );
    });

    it("should fail to fetch products if an invalid jwt is passed", async () => {
        const response = await request(app)
            .get("/api/v1/product/all")
            .set("Authorization", `Bearer ${process.env.INVALID_TOKEN}`);

        expect([401, 400]).toContain(response.status);
        expect(response.body).toHaveProperty("error");
    });

    it("should fetch products if the details are valid", async () => {
        const response = await request(app)
            .get("/api/v1/product/all")
            .set("Authorization", `Bearer ${process.env.TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("products");
    });
});
