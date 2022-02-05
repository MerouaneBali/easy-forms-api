const axios = require("axios").default;

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.headers.common[
  "Authorization"
] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUyRnNkR1ZrWDE5SVp4djhXQU1RMEs2bGR6V29hdW54cllDQUdDajlhRjQ2MDFQT1Y2NmNYN1lNbjZtd2crdUoiLCJpYXQiOjE2MzY4MTA2MzMsImV4cCI6MjM1NjgxMDYzM30.GU16sZSdjXO_kCqbuv--_rkPUeazf5FgqS1miZ9nTtI`;

describe("Test /profile POST end-point", () => {
  it("should override Mongoose user object properties", async () => {
    const res = await axios.post("/profile/update", {
      name: "merouane",
      email: "merouane.bali.inbox@gmail.com",
      password: "password123",
      passwordConfirmation: "password123",
    });

    expect(res.status).toEqual(200);
  });

  it("should return 400 with a validation error because of empty post request", async () => {
    try {
      await axios.post("/profile/update", {});
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.details[0].message).toEqual(
        "Can not submit empty form, at least one field must be populated"
      );
    }
  });

  it("should return 400 with a validation error because name is type of Number", async () => {
    try {
      await axios.post("/profile/update", {
        name: 420,
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
      await axios.post("/profile/update", {
        email: "not_an_email",
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
      await axios.post("/profile/update", {
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
      await axios.post("/profile/update", {
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
      await axios.post("/profile/update", {
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
