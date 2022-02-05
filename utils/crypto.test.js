const crypto = require("./crypto");
const env = require("../configs/env");

describe("Test crypto.encrypt()", () => {
  it("should return cyphered user ID", async () => {
    expect(await crypto.encrypt("6189807516eb96efafdf8a0b")).toEqual(
      expect.any(String)
    );
  });

  test("should error bacause of missing `message` argument", async () => {
    try {
      await crypto.encrypt();
    } catch (error) {
      expect(error).toEqual(expect.any(Error));
    }
  });
});

describe("Test crypto.decrypt()", () => {
  it("should return decrypted user ID", async () => {
    expect(
      await crypto.decrypt(
        "U2FsdGVkX1/EjPH7DbPlHr4/8Qm5RjXd62ka1Ta5VJIFkTbLMiEgLq1ctoRvSKBX"
      )
    ).toEqual("6189807516eb96efafdf8a0b");
  });

  test("should error bacause `encrypted` argument is invalid", async () => {
    try {
      await crypto.decrypt("some invalid cypher");
    } catch (error) {
      expect(error).toEqual(expect.any(Error));
    }
  });

  test("should error bacause of missing `encrypted` argument", async () => {
    try {
      await crypto.decrypt();
    } catch (error) {
      expect(error).toEqual(expect.any(Error));
    }
  });
});
