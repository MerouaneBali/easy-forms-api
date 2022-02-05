const authToken = require("./authToken");
const env = require("../configs/env");

describe("Test authToken.sign()", () => {
  it("should return JWT with `_id` property containing cyphered user ID", async () => {
    expect(await authToken.sign("6189807516eb96efafdf8a0b")).toEqual(
      expect.stringMatching(
        /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_.+/=]*$/
      )
    );
  });

  test("should error bacause of missing `id` argument", async () => {
    try {
      await authToken.sign();
    } catch (error) {
      expect(error).toEqual(expect.any(Error));
    }
  });
});

describe("Test authToken.verify()", () => {
  it("should return deciphered user ID from `_id` property contained in given JWT argument", async () => {
    expect(
      await authToken.verify(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUyRnNkR1ZrWDE5SVp4djhXQU1RMEs2bGR6V29hdW54cllDQUdDajlhRjQ2MDFQT1Y2NmNYN1lNbjZtd2crdUoiLCJpYXQiOjE2MzY4MTA2MzMsImV4cCI6MjM1NjgxMDYzM30.GU16sZSdjXO_kCqbuv--_rkPUeazf5FgqS1miZ9nTtI"
      )
    ).toEqual("6189807516eb96efafdf8a0b");
  });

  it("should error because token is invalid", async () => {
    try {
      await authToken.verify("This is not a token");
    } catch (error) {
      expect(error).toEqual(new Error(400));
    }
  });

  it("should error because token is expired", async () => {
    try {
      await authToken.verify(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUyRnNkR1ZrWDEvRWpQSDdEYlBsSHI0LzhRbTVSalhkNjJrYTFUYTVWSklGa1RiTE1pRWdMcTFjdG9SdlNLQlgiLCJpYXQiOjE2MzY4MTA5MzYsImV4cCI6MjM1NjgxMDkzNn0.AZZw1gpvqIv0Oa_ifPoVJhiSGHYnOS7-bSJ4p9sD5zo"
      );
    } catch (error) {
      expect(error).toEqual(new Error(403));
    }
  });

  it("should error bacause of missing `token` argument", async () => {
    try {
      await authToken.verify();
    } catch (error) {
      expect(error).toEqual(expect.any(Error));
    }
  });
});
