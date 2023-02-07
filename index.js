const { Deta } = require("deta");
const j = require("joi");
const morgan = require("morgan");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(morgan("common"));
app.use(cors());

const deta = Deta();

const db = deta.Base("otps");

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/otp", async (req, res) => {
  const schema = j.object({
    otp: j.number().max(99999999).required(),
    vendor: j.string().required(),
  });
  const payload = j.attempt(req.body, schema);
  const otp = await db.put({ ...payload, createdAt: Date.now() }, undefined, {
    expireIn: 600,
  });
  res.json(otp);
});

app.get("/otp", async (req, res) => {
  const otps = await db.fetch({}, { limit: 10 });
  res.json(otps);
});

// export 'app'
module.exports = app;
