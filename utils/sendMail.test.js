const sendMail = require("./sendMail");

// test("should send email using given arguments", async () => {
//   expect(
//     await sendMail(
//       "merouane.bali.inbox@gmail.com",
//       "Testing sendMail() function",
//       "Hello there! I'm testing sendMail() function"
//     )
//   ).toEqual(expect.any(Object));
// });

test("should error because of missing arguments", async () => {
  try {
    await sendMail(
      "merouane.bali.inbox@gmail.com",
      "Testing sendMail() function"
    );
  } catch (e) {
    expect(e).toEqual(expect.any(Error));
  }
});
