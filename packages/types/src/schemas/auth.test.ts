import { describe, expect, it } from "vitest";
import {
  AuthResponse,
  GoogleExchangeBody,
  LoginBody,
  RegisterBody,
  UserExportResponse,
} from "./auth";

describe("LoginBody", () => {
  it("accepts any non-empty password", () => {
    expect(LoginBody.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });
  it("rejects invalid emails", () => {
    expect(LoginBody.safeParse({ email: "x", password: "x" }).success).toBe(false);
  });
  it("rejects empty passwords", () => {
    expect(LoginBody.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});

describe("RegisterBody", () => {
  it("requires a strong password", () => {
    expect(
      RegisterBody.safeParse({
        firstName: "A",
        lastName: "B",
        email: "a@b.com",
        phone: "+54 9 11",
        password: "alllowercase",
      }).success,
    ).toBe(false);
    expect(
      RegisterBody.safeParse({
        firstName: "A",
        lastName: "B",
        email: "a@b.com",
        phone: "+54 9 11",
        password: "Short1",
      }).success,
    ).toBe(false);
    expect(
      RegisterBody.safeParse({
        firstName: "A",
        lastName: "B",
        email: "a@b.com",
        phone: "+54 9 11",
        password: "GoodOne1",
      }).success,
    ).toBe(true);
  });
  it("rejects short phone numbers", () => {
    expect(
      RegisterBody.safeParse({
        firstName: "A",
        lastName: "B",
        email: "a@b.com",
        phone: "+54",
        password: "GoodOne1",
      }).success,
    ).toBe(false);
  });
});

describe("GoogleExchangeBody", () => {
  it("requires a non-trivial idToken", () => {
    expect(GoogleExchangeBody.safeParse({ idToken: "short" }).success).toBe(false);
    expect(GoogleExchangeBody.safeParse({ idToken: "verylongtokenplease" }).success).toBe(true);
  });
});

describe("AuthResponse", () => {
  it("requires an ISO timestamp and a role from the enum", () => {
    const r = AuthResponse.safeParse({
      token: "t",
      expiresAt: new Date().toISOString(),
      user: {
        id: "u",
        email: "a@b.com",
        firstName: "A",
        lastName: "B",
        role: "owner",
        providerId: null,
      },
    });
    expect(r.success).toBe(true);
  });
  it("rejects unknown roles", () => {
    const r = AuthResponse.safeParse({
      token: "t",
      expiresAt: new Date().toISOString(),
      user: {
        id: "u",
        email: "a@b.com",
        firstName: "A",
        lastName: "B",
        role: "god",
        providerId: null,
      },
    });
    expect(r.success).toBe(false);
  });
});

describe("UserExportResponse", () => {
  it("parses a minimal shape", () => {
    const r = UserExportResponse.safeParse({
      exportedAt: new Date().toISOString(),
      user: { id: "u" },
      provider: null,
      bids: [],
    });
    expect(r.success).toBe(true);
  });
});
