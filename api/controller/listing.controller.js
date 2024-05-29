const Listing = require("../Model/listing.model");
const User = require("../Model/user.model");
const errorHandler = require("../utils/error");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can only delete you own list"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing deleted successfully");
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can edit you own listing"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(201).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "listing not found"));
    }
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,

};
