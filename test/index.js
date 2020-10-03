const chai = require("chai");
const chaiHTTP = require("chai-http");
const expect = chai.expect;
const app = require("../app");
const fs = require("fs");

chai.use(chaiHTTP);

describe("API ENDPOINT TESTING", () => {
  it("GET Landing Page", (done) => {
    chai
      .request(app)
      .get("/api/v1/customer/landing-page")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("Object");
        expect(res.body).to.have.property("hero");
        expect(res.body.hero).to.have.all.keys(
          "traveler",
          "treasure",
          "cities"
        );
        expect(res.body).to.have.property("mostPicked");
        expect(res.body.mostPicked).to.have.an("array");
        expect(res.body).to.have.property("category");
        expect(res.body.category).to.have.an("array");
        expect(res.body).to.have.property("testimonial");
        expect(res.body.testimonial).to.have.an("object");
        done();
      });
  });
  it("GET Detail Page", (done) => {
    chai
      .request(app)
      .get("/api/v1/customer/detail-page/5e96cbe292b97300fc902223")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("Object");
        expect(res.body).to.have.property("country");
        expect(res.body).to.have.property("isPopular");
        expect(res.body).to.have.property("sumBooking");
        expect(res.body).to.have.property("unit");
        expect(res.body).to.have.property("imageId");
        expect(res.body.imageId).to.have.an("array");
        expect(res.body).to.have.property("featureId");
        expect(res.body.featureId).to.have.an("array");
        expect(res.body).to.have.property("activityId");
        expect(res.body.activityId).to.have.an("array");
        expect(res.body).to.have.property("bank");
        expect(res.body.bank).to.have.an("array");
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("city");
        expect(res.body).to.have.property("description");
        expect(res.body).to.have.property("__v");
        expect(res.body).to.have.property("testimonial");
        expect(res.body.testimonial).to.have.an("object");
        done();
      });
  });
  it("POST Booking Page", (done) => {
    const image = __dirname + "/paymentProof.png";
    const dataSample = {
      image,
      idItem: "5e96cbe292b97300fc902222",
      duration: 2,
      bookingStartDate: "10-10-2020",
      bookingEndDate: "12-10-2020",
      firstName: "El",
      lastName: "Sueno",
      email: "elsueno@thecartel.com",
      phoneNumber: "08548877487",
      accountHolder: "El Sueno",
      originatingBank: "Bank of Bolivia",
    };
    chai
      .request(app)
      .post("/api/v1/customer/booking-page")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("idItem", dataSample.idItem)
      .field("duration", dataSample.duration)
      .field("bookingStartDate", dataSample.bookingStartDate)
      .field("bookingEndDate", dataSample.bookingEndDate)
      .field("firstName", dataSample.firstName)
      .field("lastName", dataSample.lastName)
      .field("email", dataSample.email)
      .field("phoneNumber", dataSample.phoneNumber)
      .field("accountHolder", dataSample.accountHolder)
      .field("originatingBank", dataSample.originatingBank)
      .attach("image", fs.readFileSync(dataSample.image), "paymentProof.png")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("Object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Booking Success !");
        expect(res.body).to.have.property("booking");
        expect(res.body.booking).to.have.all.keys(
          "payment",
          "_id",
          "invoice",
          "bookingStartDate",
          "bookingEndDate",
          "total",
          "itemId",
          "memberId",
          "__v"
        );
        expect(res.body.booking.payment).to.have.all.keys(
          "status",
          "paymentProof",
          "originatingBank",
          "accountHolder"
        );
        expect(res.body.booking.itemId).to.have.all.keys(
          "_id",
          "title",
          "price",
          "duration"
        );
        done();
      });
  });
});
