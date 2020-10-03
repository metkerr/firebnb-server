const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Member = require("../models/Member");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");

module.exports = {
  //AUTH
  viewLogin: async (req, res) => {
    try {
      const totalMember = await Member.countDocuments();
      const totalItem = await Item.countDocuments();
      const totalBooking = await Booking.countDocuments();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("index", {
          title: "Login",
          alert,
        });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      res.redirect("/admin/login");
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });
      if (!user) {
        req.flash(
          "alertMessage",
          `Username is not found / Password not match!`
        );
        req.flash("alertStatus", "danger");
        res.redirect("/admin/login");
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash(
          "alertMessage",
          `Username is not found / Password not match!`
        );
        req.flash("alertStatus", "danger");
        res.redirect("/admin/login");
      }
      req.session.user = {
        id: user.id,
        username: user.username,
      };
      res.redirect("/admin/dashboard");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/login");
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
  },
  //------DASHBOARD------
  viewDashboard: async (req, res) => {
    const totalMember = await Member.count();
    const totalItem = await Item.count();
    const totalBooking = await Booking.count();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/dashboard/view_dashboard", {
      title: "Dashboard",
      user: req.session.user,
      totalMember,
      totalItem,
      totalBooking,
      alert,
    });
  },

  //------CATEGORY------
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "Category",
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "New category added !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { _id, name } = req.body;
      const category = await Category.findById(_id);
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Category updated !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      await category.remove();
      req.flash("alertMessage", "Category deleted !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  //------BANK------
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/bank/view_bank", {
        bank,
        title: "Bank",
        alert,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { name, bankName, accountNumber } = req.body;
      const imageUrl = `images/${req.file.filename}`;
      await Bank.create({ bankName, accountNumber, name, imageUrl });
      req.flash("alertMessage", "New bank account added !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      const { id, name, bankName, accountNumber } = req.body;
      const bank = await Bank.findById(id);
      if (req.file !== undefined) {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.imageUrl = `images/${req.file.filename}`;
      }
      bank.bankName = bankName;
      bank.accountNumber = accountNumber;
      bank.name = name;
      await bank.save();
      req.flash("alertMessage", "Bank updated !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findById(id);
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMessage", "Bank deleted !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  //------ITEM------
  viewItem: async (req, res) => {
    try {
      const item = await Item.find()
        .populate("imageId", "id imageUrl")
        .populate("categoryId", "id name");
      const category = await Category.find();
      const countryData = require("../json/country-city.json");
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Item",
        category,
        alert,
        item,
        action: "view",
        user: req.session.user,
        countryData,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, country, city, about } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findById({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          description: about,
          price,
          country,
          city,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (files of req.files) {
          const imageSave = await Image.create({
            imageUrl: `images/${files.filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
        }
        await item.save();
        req.flash("alertMessage", "item added !");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showItemImage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findById(id).populate("imageId", "id imageUrl");
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Item Image",
        alert,
        item,
        action: "show image",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findById(id)
        .populate("imageId", "id imageUrl")
        .populate("categoryId", "id name");
      const category = await Category.find();
      const countryData = require("../json/country-city.json");
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Edit Item",
        alert,
        item,
        category,
        action: "edit item",
        user: req.session.user,
        countryData,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, city, about } = req.body;
      const item = await Item.findById(id)
        .populate("imageId", "id imageUrl")
        .populate("categoryId", "id name");
      if (req.files.length > 0) {
        for (i in item.imageId) {
          const imageUpdate = await Image.findById(item.imageId[i]._id);
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
      }
      item.title = title;
      item.price = price;
      item.city = city;
      item.description = about;
      item.categoryId = categoryId;
      await item.save();
      req.flash("alertMessage", "Item updated !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findById(id);
      const itemCategory = await Category.findById(item.categoryId);
      await Feature.find({ itemId: id }).remove();
      try {
        for (i in item.imageId) {
          const imageUpdate = await Image.findById(item.imageId[i]._id);
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.remove();
        }
      } catch (error) {
        console.error(error);
      }
      itemCategory.itemId.pull(id);
      await itemCategory.save();
      item.remove();
      req.flash("alertMessage", "Item deleted !");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  //Detail Item
  viewDetailItem: async (req, res) => {
    try {
      const { itemId } = req.params;
      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/detail_item/view_detail_item", {
        title: "Detail Item",
        alert,
        itemId,
        feature,
        activity,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  //Feature
  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        console.log("test");
        req.flash("alertMessage", `image not found`);
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });
      const item = await Item.findById(itemId);
      item.featureId.push(feature._id);
      await item.save();
      req.flash("alertMessage", "Feature Added !");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editFeature: async (req, res) => {
    try {
      const { id, name, qty, itemId } = req.body;
      const feature = await Feature.findById(id);
      if (req.file !== undefined) {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.imageUrl = `images/${req.file.filename}`;
      }
      feature.name = name;
      feature.qty = qty;
      await feature.save();
      req.flash("alertMessage", "Feature updated !");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteFeature: async (req, res) => {
    const { id } = req.params;
    const feature = await Feature.findById(id);
    const itemId = feature.itemId;
    try {
      const item = await Item.findById(itemId);
      item.featureId.pull(id);
      await item.save();
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash("alertMessage", "Feature deleted !");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  // Activity
  addActivty: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      if (!req.file) {
        console.log("test");
        req.flash("alertMessage", `image not found`);
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const activty = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });
      const item = await Item.findById(itemId);
      item.activityId.push(activty._id);
      await item.save();
      req.flash("alertMessage", "Activity Added !");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    try {
      const { id, name, type, itemId } = req.body;
      const activity = await Activity.findById(id);
      if (req.file !== undefined) {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.imageUrl = `images/${req.file.filename}`;
      }
      activity.name = name;
      activity.type = type;
      await activity.save();
      req.flash("alertMessage", "Activity updated !");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteActivity: async (req, res) => {
    const { id } = req.params;
    const activity = await Activity.findById(id);
    const itemId = activity.itemId;
    try {
      const item = await Item.findById(itemId);
      item.activityId.pull(id);
      await item.save();
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash("alertMessage", "Activity deleted !");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  //------BOOKING------
  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate("memberId")
        .populate("bankId");
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/booking/view_booking", {
        title: "Booking",
        user: req.session.user,
        booking,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/booking");
    }
  },

  viewDetailBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findById(id)
        .populate("memberId")
        .populate("bankId");
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/booking/detail_booking", {
        title: `Detail Booking: ${booking.memberId.firstName} ${booking.memberId.lastName}`,
        user: req.session.user,
        booking,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/booking`);
    }
  },

  bookingConfirmation: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findById(id);
      booking.payment.status = "Accepted";
      await booking.save();
      console.log(booking.payment.status);
      req.flash("alertMessage", "Booking Accepted !");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/booking/${id}`);
    }
  },

  bookingRejection: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findById(id);
      booking.payment.status = "Canceled / Rejected";
      await booking.save();
      req.flash("alertMessage", "Booking Canceled / Rejected !");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/booking/${id}`);
    }
  },
};
