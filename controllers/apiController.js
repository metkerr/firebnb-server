const Item = require("../models/Item");
const Treasure = require("../models/Activity");
const Traveler = require("../models/Member");
const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Member = require("../models/Member");
const Booking = require("../models/Booking");
module.exports = {
  landingPage: async (req, res) => {
    try {
      const treasure = await Treasure.countDocuments();
      const traveler = await Traveler.countDocuments();
      const cities = await Item.countDocuments();
      const mostPicked = await Item.find()
        .populate("imageId", "_id imageUrl")
        .select("_id title country city price unit")
        .limit(7);
      const category = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title country city isPopular sumBooking",
          perDocumentLimit: 4,
          options: { sort: { sumBooking: -1 } },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      for (i in category) {
        for (x in category[i].itemId) {
          const item = await Item.findById(category[i].itemId[x]._id);
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[x] === category[i].itemId[0]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial-landing-pages.jpg",
        name: "Lloyd Irving",
        rate: 4.5,
        content:
          "What a wonderful experience! The hotel was excellent, full of character, quiet & secluded. This was our fourth trip with Firebnb and it lived up to my very high expectations.",
        familyOccupation: "Photographer",
      };
      res.status(200).json({
        hero: {
          treasure,
          traveler,
          cities,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error !" });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findById(id)
        .populate("featureId", "_id name qty imageUrl")
        .populate("activityId", "_id name type imageUrl")
        .populate("imageId", "_id imageUrl");
      const bank = await Bank.find();

      testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial1.jpg",
        name: "El Sueno",
        rate: 5,
        content:
          "Excellent stay, worthy enough for money & no doubt atall in recommending to friends.",
        familyOccupation: "Entrepreneur",
      };
      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error !" });
    }
  },

  bookingPage: async (req, res) => {
    const {
      idItem,
      duration,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      originatingBank,
    } = req.body;

    if (!req.file) {
      return res.status(404).json({ message: "Image not found !" });
    }
    if (
      idItem === undefined ||
      duration === undefined ||
      bookingStartDate === undefined ||
      bookingEndDate === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      phoneNumber === undefined ||
      accountHolder === undefined ||
      originatingBank === undefined
    ) {
      return res
        .status(404)
        .json({ message: "Please fill all the data fields !" });
    }

    const item = await Item.findById(idItem);

    if (!item) {
      return res.status(404).json({
        message: "Item not found !",
      });
    }
    item.sumBooking += 1;
    await item.save();

    const total = item.price * duration;
    const tax = total * 0.1; //tax 10%

    const invoice = Math.floor(1000000 + Math.random() * 9999999);

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total: total + tax,
      itemId: {
        _id: item._id,
        title: item.title,
        price: item.price,
        duration,
      },
      memberId: member.id,
      payment: {
        paymentProof: `images/${req.file.filename}`,
        originatingBank,
        accountHolder,
      },
    };

    const booking = await Booking.create(newBooking);

    res.status(201).json({ message: "Booking Success !", booking });
  },
};
