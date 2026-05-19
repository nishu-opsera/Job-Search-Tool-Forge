import { describe, expect, it } from "vitest";
import { buildApp } from "./app.js";

describe("buildApp", () => {
  it("GET / returns API info", async () => {
    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/" });
    expect(response.statusCode).toBe(200);
    const body = response.json() as { status: string; endpoints: { health: string } };
    expect(body.status).toBe("ok");
    expect(body.endpoints.health).toBe("/api/healthz");
    await app.close();
  });

  it("GET /api/healthz returns status ok", async () => {
    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/api/healthz" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
    await app.close();
  });
});
