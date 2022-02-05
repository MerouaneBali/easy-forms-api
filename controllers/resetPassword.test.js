const resetPassword = require("./resetPassword");

describe("Test resetPassword.start()", () => {
  it("should send reset password link through email", async () => {
    expect(
      await resetPassword.start("merouane.bali.inbox@gmail.com", "newPassword")
    ).toEqual(expect.any(Object));
  });

  it("should error because of missing arguments", async () => {
    try {
      await resetPassword.start();
    } catch (error) {
      expect(error).toEqual(expect.any(Error));
    }
  });
});

describe("Test resetPassword.check()", () => {
  it("should verify/decode token from reset password link", async () => {
    expect(
      await resetPassword.check(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lcm91YW5lLmJhbGkuaW5ib3hAZ21haWwuY29tIiwiaWF0IjoxNjM2NzMyNjM2LCJleHAiOjk2MjQ0NzMyNjM2fQ.gKisdMpYW1RWpT6o1K4xYzBZ8CAloaYIhbCyBWrP3U8"
      )
    ).toEqual({
      email: "merouane.bali.inbox@gmail.com",
      iat: 1636732636,
      exp: 96244732636,
    });
  });

  it("should error because token from reset password link is invalid", async () => {
    try {
      await resetPassword.check("This is not a token");
    } catch (error) {
      expect(error).toEqual(new Error(400));
    }
  });

  it("should error because token from reset password link is expired", async () => {
    try {
      await resetPassword.check(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lcm91YW5lLmJhbGkuaW5ib3hAZ21haWwuY29tIiwiaWF0IjoxNjM2NDAxMjY5LCJleHAiOjE2MzY0MjI4Njl9.FrMVGtX2fh8Os31jMyS-bXDs19QoFarNsdK7d0iq-Uc"
      );
    } catch (error) {
      expect(error).toEqual(new Error(403));
    }
  });
});

describe("Test resetPassword.reset()", () => {
  // FIX: Can not use model
  // it("should error because of user argument is not an object instance of User model", async () => {
  //   try {
  //     await resetPassword.reset("some random data type");
  //   } catch (error) {
  //     expect(error).toEqual(expect.any(TypeError));
  //   }
  // });

  it("should error because of missing user argument", async () => {
    try {
      await resetPassword.reset();
    } catch (error) {
      expect(error).toEqual(expect.any(Error));
    }
  });
});
