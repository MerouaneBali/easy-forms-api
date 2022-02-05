const emailVerification = require("./emailVerification");

describe("Test emailVerification.start()", () => {
  it("should send email verification link through email", async () => {
    expect(
      await emailVerification.start("merouane.bali.inbox@gmail.com")
    ).toEqual(expect.any(Object));
  });

  it("should error because of missing email argument", async () => {
    try {
      await emailVerification.start();
    } catch (error) {
      expect(error).toEqual(expect.any(Error));
    }
  });
});

describe("Test emailVerification.check()", () => {
  it("should verify/decode token from email verification link", async () => {
    expect(
      await emailVerification.check(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lcm91YW5lLmJhbGkuaW5ib3hAZ21haWwuY29tIiwiaWF0IjoxNjM2NzMyNjM2LCJleHAiOjk2MjQ0NzMyNjM2fQ.gKisdMpYW1RWpT6o1K4xYzBZ8CAloaYIhbCyBWrP3U8"
      )
    ).toEqual({
      email: "merouane.bali.inbox@gmail.com",
      iat: 1636732636,
      exp: 96244732636,
    });
  });

  it("should error because token from email verification link is invalid", async () => {
    try {
      await emailVerification.check("This is not a token");
    } catch (error) {
      expect(error).toEqual(new Error(400));
    }
  });

  it("should error because token from email verification link is expired", async () => {
    try {
      await emailVerification.check(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lcm91YW5lLmJhbGkuaW5ib3hAZ21haWwuY29tIiwiaWF0IjoxNjM2NDAxMjY5LCJleHAiOjE2MzY0MjI4Njl9.FrMVGtX2fh8Os31jMyS-bXDs19QoFarNsdK7d0iq-Uc"
      );
    } catch (error) {
      expect(error).toEqual(new Error(403));
    }
  });
});

describe("Test emailVerification.verifyEmail()", () => {
  // FIX: Can not use model
  // it("should override `emailVerified` property of Mongoose user object", async () => {
  //   const user = await db.User.findOne({
  //     email: "merouane.bali.inbox@gmail.com",
  //   });

  //   expect(await emailVerification.verifyEmail(user)).not.rejects.toThrow(
  //     expect.any(Error)
  //   );
  // });

  it("should error because of missing user argument", async () => {
    try {
      await emailVerification.verifyEmail();
    } catch (error) {
      expect(error).toEqual(expect.any(Error));
    }
  });
});
