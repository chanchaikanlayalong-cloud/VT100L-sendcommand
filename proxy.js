import express from "express";
import fetch from "node-fetch";
const app = express();
app.use(express.json());

app.post("/send", async (req, res) => {
  const response = await fetch("http://18.142.155.204:8082/api/commands/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + Buffer.from("admin:admin123").toString("base64")
    },
    body: JSON.stringify(req.body)
  });
  const text = await response.text();
  res.status(response.status).send(text);
});

app.listen(3000, () => console.log("Proxy running at http://localhost:3000"));
