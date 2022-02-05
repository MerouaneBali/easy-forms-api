const axios = require("axios").default;

axios.defaults.baseURL = "http://localhost:5000";

describe("Test /authentication/register POST end-point", () => {
  it("should override Mongoose user object properties", async () => {
    const res = await axios.post("/authentication/register", {
      name: "User",
      email: "new.user@company.com",
      password: "password123",
      passwordConfirmation: "password123",
    });

    expect(res.status).toEqual(201);
  });

  it("should override Mongoose user object properties", async () => {
    try {
      await axios.post("/authentication/register", {
        name: "merouane",
        email: "merouane.bali.inbox@gmail.com",
        password: "password123",
        passwordConfirmation: "password123",
      });
    } catch (error) {
      expect(error.response.status).toEqual(409);
    }
  });

  it("should return 400 with a validation error because of empty post request", async () => {
    try {
      await axios.post("/authentication/register", {});
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        '"name" is required'
      );
    }
  });

  it("should return 400 with a validation error because name is type of Number", async () => {
    try {
      await axios.post("/authentication/register", {
        name: 420,
        email: "new.user@company.com",
        password: "password123",
        passwordConfirmation: "password123",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        "Name must only contain alphabetic characters"
      );
    }
  });

  it("should return 400 with a validation error because email is invalid", async () => {
    try {
      await axios.post("/authentication/register", {
        name: "User",
        email: "not_an_email",
        password: "password123",
        passwordConfirmation: "password123",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        '"email" must be a valid email'
      );
    }
  });

  it("should return 400 with a validation error because password length is less than 8 characters", async () => {
    try {
      await axios.post("/authentication/register", {
        name: "User",
        email: "new.user@company.com",
        password: "pw",
        passwordConfirmation: "pw2",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        "Password should be between 8 and 24 characters long"
      );
    }
  });

  it("should return 400 with a validation error because of password and passwordConfirmation fields are invalid", async () => {
    try {
      await axios.post("/authentication/register", {
        name: "User",
        email: "new.user@company.com",
        password: "password2>8",
        passwordConfirmation: "password2>8",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        '"password" with value "password2>8" fails to match the required pattern: /^[a-zA-Z0-9!@#_$\\s]*$/'
      );
    }
  });

  it("should return 400 with a validation error because of password and passwordConfirmation fields do not match", async () => {
    try {
      await axios.post("/authentication/register", {
        name: "User",
        email: "new.user@company.com",
        password: "matching",
        passwordConfirmation: "not_matching",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        "Passwords do not much"
      );
    }
  });
});

describe("Test /authentication/login POST end-point", () => {
  it("should return 200 with authorization JWT", async () => {
    const res = await axios.post("/authentication/login", {
      email: "new.user@company.com",
      password: "password123",
    });

    expect(res.status).toEqual(200);
    // expect(res.headers["set-cookie"][0]).toEqual(
    //   expect.stringMatching(
    //     /^session=[a-zA-Z0-9-_]*; Path=/; Expires$/
    //   )
    // );
  });

  it("should return 400 because of wrong password", async () => {
    try {
      await axios.post("/authentication/login", {
        email: "merouane.bali.inbox@gmail.com",
        password: "wrong_password",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
    }
  });

  it("should 404 because no user with this email exists", async () => {
    try {
      await axios.post("/authentication/login", {
        email: "email.does.not.exist@gmail.com",
        password: "password123",
      });
    } catch (error) {
      expect(error.response.status).toEqual(404);
    }
  });

  it("should return 400 with a validation error because of empty post request", async () => {
    try {
      await axios.post("/authentication/login", {});
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        '"email" is required'
      );
    }
  });

  it("should return 400 with a validation error because email is invalid", async () => {
    try {
      await axios.post("/authentication/login", {
        email: "not_an_email",
        password: "password123",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        '"email" must be a valid email'
      );
    }
  });

  it("should return 400 with a validation error because password length is less than 8 characters", async () => {
    try {
      await axios.post("/authentication/login", {
        email: "new.user@company.com",
        password: "pw",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        "Password should be between 8 and 24 characters long"
      );
    }
  });

  it("should return 400 with a validation error because of password and passwordConfirmation fields are invalid", async () => {
    try {
      await axios.post("/authentication/login", {
        email: "new.user@company.com",
        password: "password2>8",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        '"password" with value "password2>8" fails to match the required pattern: /^[a-zA-Z0-9!@#_$\\s]*$/'
      );
    }
  });
});

describe("Test /authentication/verifyEmail POST end-point", () => {
  it("should return 200", async () => {
    const res = await axios.post("/authentication/verifyEmail", {
      email: "merouane.bali.inbox@gmail.com",
    });

    expect(res.status).toEqual(200);
  });

  it("should return 400 with a validation error because of empty post request", async () => {
    try {
      await axios.post("/authentication/verifyEmail", {});
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        '"email" is required'
      );
    }
  });

  it("should return 400 with a validation error because email is invalid", async () => {
    try {
      await axios.post("/authentication/login", {
        email: "not_an_email",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        '"email" must be a valid email'
      );
    }
  });

  it("should return 404 because no user with this email exists", async () => {
    try {
      await axios.post("/authentication/verifyEmail", {
        email: "email.does.not.exist@gmail.com",
      });
    } catch (error) {
      expect(error.response.status).toEqual(404);
    }
  });
});

describe("Test /authentication/resetPassword POST end-point", () => {
  it("should return 200", async () => {
    const res = await axios.post("/authentication/resetPassword", {
      email: "merouane.bali.inbox@gmail.com",
      newPassword: "password123",
      newPasswordConfirmation: "password123",
    });

    expect(res.status).toEqual(200);
  });

  it("should return 400 with a validation error because of empty post request", async () => {
    try {
      await axios.post("/authentication/resetPassword", {});
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data[0].message).toEqual('"email" is required');
    }
  });

  it("should return 400 with a validation error because email is invalid", async () => {
    try {
      await axios.post("/authentication/login", {
        email: "not_an_email",
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        '"email" must be a valid email'
      );
    }
  });

  it("should return 404 because no user with this email exists", async () => {
    try {
      await axios.post("/authentication/resetPassword", {
        email: "email.does.not.exist@gmail.com",
        newPassword: "password123",
        newPasswordConfirmation: "password123",
      });
    } catch (error) {
      expect(error.response.status).toEqual(404);
    }
  });
});
