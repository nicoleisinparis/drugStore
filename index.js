const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost/drugStore");

const Drug = mongoose.model("Drug", {
  name: String,
  quantity: Number,
});

app.post("/drugs", async (req, res) => {
  try {
    const existDrug = await Drug.findOne({ name: req.body.name });
    console.log(existDrug);
    //   console.log(req.body);
    //   console.log("ok");

    if (existDrug !== null)
      return res.status(400).json({
        message: "Drugs exists in DB",
      });

    const newDrug = new Drug({
      name: req.body.name,
      quantity: req.body.quantity,
    });
    //   console.log(newDrug);
    //   res.json("it's registered");
    await newDrug.save();
    res.json(newDrug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/drugs", async (req, res) => {
  try {
    const drugs = await Drug.find();
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/drugs/add", async (req, res) => {
  try {
    const updateDrug = await Drug.findById(req.body._id);
    console.log(updateDrug);
    if (updateDrug) {
      updateDrug.quantity += req.body.quantity;
      await updateDrug.save();
      res.json(updateDrug);
    } else {
      res.status(400).json({
        message: "Bad request",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });

    if (req.body.quantity > updateDrug.quantity) {
      return res.status(400).json({
        message: "invalid quantity",
      });
    }
  }

  //   console.log(req.params);
});

app.put("/drugs/remove", async (req, res) => {
  try {
    const removeDrug = await Drug.findById(req.body._id);
    // console.log(removeDrug);
    if (removeDrug) {
      removeDrug.quantity -= req.body.quantity;
      await removeDrug.save();
      res.json(removeDrug);
    } else {
      res.status(400).json({
        message: "not enough qty",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/drugs/quantity", async (req, res) => {
  const findDrug = await Drug.findOne(req.query.name);
  //   console.log(findDrug.quantity);
  if (findDrug !== req.query.name) {
    res.status(400).json({ message: "product isn't exist" });
  } else {
    res.json(findDrug.quantity);
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(3000, () => {
  console.log("server started");
});
