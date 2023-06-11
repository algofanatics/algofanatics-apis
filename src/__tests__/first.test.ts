// import request from 'supertest';
// import app from "./../index";
// import mongoose from "mongoose";

// jest.setTimeout(300000);
// beforeAll((done) => {
//   mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//       console.log("DB connected successfully");
//       done();
//     })
//     .catch((err) => {
//       console.log(err);
//       process.exit(1);
//     });
// });
// afterAll((done) => {
//   mongoose.connection.close();
//   done();
// });

// /*
// hits the base url, should return an error response and resources unavailable
//  */
// describe("GET / ", () => {
//   test("It should respond with error", async () => {
//     const response = await request(app).get("/");
//     expect(response.body).toMatchObject({
//       success: false,
//       message: "Resource unavailable",
//     });
//     expect(response.statusCode).toBe(400);
//   });
// });

// /*
// Logs in a test user, returns a JWT and status code of 200
//  */
// describe("POST /users/login ", () => {
//   test("It should successfully log an existing user in", async () => {
//     const response = await request(app)
//       .post("/users/login")
//       .expect("Content-Type", /json/)
//       .send({
//         email: "ebuka422@gmail.com",
//         pin: "1111",
//       });

//     expect(response.body).toHaveProperty("token");
//     expect(response.body).toHaveProperty("success", true);
//     expect(response.statusCode).toBe(200);
//   });
// });

// /*
// Initialize a paystack payment link for a dummy savings plan
//  */
// // describe("POST /subscriptions/initialize", () => {
// //   test("It should fetch paystack payment link for a savings plan", async () => {
// //     const response = await request(app)
// //       .post("/users/login")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         email: "ebuka422@gmail.com",
// //         pin: "1111",
// //       });

// //     expect(response.body).toHaveProperty("token");
// //     expect(response.body).toHaveProperty("success", true);
// //     expect(response.statusCode).toBe(200);

// //     const data = await request(app)
// //       .post("/subscriptions/initialize")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         amount: 50000,
// //         planId: "61d43d6423e99e7d6a686cee",
// //       })
// //       .set("Authorization", `Bearer ${response.body.token}`);

// //     expect(data.body).toHaveProperty("data");
// //     expect(data.body.data).toHaveProperty("authorization_url");
// //     expect(data.body.data).toHaveProperty("reference");
// //     expect(data.body.data).toHaveProperty("access_code");
// //     expect(data.body).toHaveProperty("success", true);
// //     expect(data.statusCode).toBe(200);
// //   });
// // });

// /*
// Generate a password reset token for a user on pebblescore
//  */
// // describe("POST /users/token", () => {
// //   test("It should return OTP and send email to user", async () => {
// //     const data = await request(app)
// //       .post("/users/token")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         email: "ebuka422@gmail.com",
// //         pin: "1111",
// //       });

// //     expect(data.body).toHaveProperty("tempToken");
// //     expect(data.body).toHaveProperty("success", true);
// //     expect(data.statusCode).toBe(200);
// //   });
// // });

// /*
// Generate a password reset token for a user on pebblescore and reset password.
//  */
// // describe("POST /users/password", () => {
// //   test("It should fetch a new password after getting a token", async () => {
// //     const response = await request(app)
// //       .post("/users/token")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         email: "ebuka422@gmail.com",
// //       });

// //     expect(response.body).toHaveProperty("tempToken");
// //     expect(response.body).toHaveProperty("success", true);
// //     expect(response.statusCode).toBe(200);

// //     const data = await request(app)
// //       .post("/users/password")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         tempToken: response.body.tempToken,
// //         email: "ebuka422@gmail.com",
// //         pin: "1111",
// //       });

// //     expect(data.body).toHaveProperty("success", true);
// //     expect(data.statusCode).toBe(200);
// //   });
// // });
// /*
// logs a user in, retrieves JWT and creates a savings plans
//  */
// // describe("POST /subscriptions/create", () => {
// //   test("It should create a savings plan", async () => {
// //     const response = await request(app)
// //       .post("/users/login")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         email: "ebuka422@gmail.com",
// //         pin: "1111",
// //       });

// //     expect(response.body).toHaveProperty("token");
// //     expect(response.body).toHaveProperty("success", true);
// //     expect(response.statusCode).toBe(200);

// //     const data = await request(app)
// //       .post("/subscriptions/create")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         amount: 25000,
// //         interval: "day",
// //         name: "Test plan",
// //         maxCount: 300,
// //         type: "savings",
// //         startDate: new Date().toISOString(),
// //         maturityDate: new Date(
// //           new Date().setMonth(new Date().getMonth() + 6)
// //         ).toISOString(),
// //       })
// //       .set("Authorization", `Bearer ${response.body.token}`);

// //     expect(data.body).toHaveProperty("plan");
// //     expect(data.body.plan).toHaveProperty("name");
// //     expect(data.body.plan).toHaveProperty("interval");
// //     expect(data.body.plan).toHaveProperty("isActive");
// //     expect(data.body).toHaveProperty("success", true);
// //     expect(data.statusCode).toBe(200);
// //   });
// // });
// /*
// Purchase a credit report with a one-time fee
//  */
// // describe("POST /subscriptions/product", () => {
// //   test("It should generate a checkout link for a one-off credit report", async () => {
// //     const response = await request(app)
// //       .post("/users/login")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         email: "ebuka422@gmail.com",
// //         pin: "1111",
// //       });

// //     expect(response.body).toHaveProperty("token");
// //     expect(response.body).toHaveProperty("success", true);
// //     expect(response.statusCode).toBe(200);

// //     const data = await request(app)
// //       .post("/subscriptions/product")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         bvn: "22237445320",
// //         amount: 2000,
// //       })
// //       .set("Authorization", `Bearer ${response.body.token}`);

// //     expect(data.body).toHaveProperty("data");
// //     expect(data.body.data).toHaveProperty("authorization_url");
// //     expect(data.body.data).toHaveProperty("reference");
// //     expect(data.body.data).toHaveProperty("access_code");
// //     expect(data.body).toHaveProperty("success", true);
// //     expect(data.statusCode).toBe(200);
// //   });
// // });

// /*
// Purchase a credit report for a subscription
//  */
// // describe("POST /subscriptions/product", () => {
// //   test("It should generate a checkout link for a credit report subscription", async () => {
// //     const response = await request(app)
// //       .post("/users/login")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         email: "ebuka422@gmail.com",
// //         pin: "1111",
// //       });

// //     expect(response.body).toHaveProperty("token");
// //     expect(response.body).toHaveProperty("success", true);
// //     expect(response.statusCode).toBe(200);

// //     const data = await request(app)
// //       .post("/subscriptions/product")
// //       .expect("Content-Type", /json/)
// //       .send({
// //         bvn: "22237445320",
// //         amount: 18000,
// //       })
// //       .set("Authorization", `Bearer ${response.body.token}`);

// //     expect(data.body).toHaveProperty("data");
// //     expect(data.body.data).toHaveProperty("authorization_url");
// //     expect(data.body.data).toHaveProperty("reference");
// //     expect(data.body.data).toHaveProperty("access_code");
// //     expect(data.body).toHaveProperty("success", true);
// //     expect(data.statusCode).toBe(200);
// //   });
// // });
