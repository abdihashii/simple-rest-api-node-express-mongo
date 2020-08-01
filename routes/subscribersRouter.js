/* using RESTful endpoints/routes */

const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriberModel");

// Getting all
router.get("/", async (req, res) => {
  try {
    // find() gets all subscribers from Model
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    // 500 means there's an error in the server, send as json because the server uses json
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getSubsciber, (req, res) => {
  res.json(res.subscriber);
});

// Creating one
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });

  try {
    // save() persists to the database
    const newSubscriber = await subscriber.save();
    // and if is successful, we want to send to user using json
    // 201 means that you've successfully created an object
    res.status(201).json(newSubscriber);
  } catch (err) {
    // 400 because there's bad data from client side
    res.status(400).json({ message: err.message });
  }
});

// Updating one, patch instead of put because we only want to update part of the info instead of all
router.patch("/:id", getSubsciber, async (req, res) => {
  if (req.body.name) {
    res.subscriber.name = req.body.name;
  }

  if (req.body.subscribedToChannel) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }

  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting one
router.delete("/:id", getSubsciber, async (req, res) => {
  const subscriberName = res.subscriber.name;

  try {
    // remove() removes from database
    await res.subscriber.remove();
    res.json({ message: `Deleted the subscriber: ${subscriberName}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware that serves as a helper method
async function getSubsciber(req, res, next) {
  let subscriber;

  try {
    // findById() gets one subscriber from Model
    subscriber = await Subscriber.findById(req.params.id);

    if (subscriber == null) {
      // 404 means you can't find something
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.subscriber = subscriber;
  next();
}

module.exports = router;
