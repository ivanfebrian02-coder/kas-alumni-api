const express = require("express");
const cors = require("cors");
const midtransClient = require("midtrans-client");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CONFIG MIDTRANS (PRODUCTION)
const snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: "Mid-server-F3oeO-e1yRZzP2L8qc15t1j6"
});

// 🔥 ENDPOINT BUAT TOKEN
app.post("/create-order", async (req, res) => {
  try {
    const { order_id, gross_amount, member, wa } = req.body;

    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount
      },
      customer_details: {
        first_name: member,
        phone: wa
      }
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      token: transaction.token
    });

  } catch (err) {
    console.error("ERROR MIDTRANS:", err);
    res.status(500).json({ error: "Gagal buat transaksi" });
  }
});

// 🔥 ROOT TEST (biar tau server hidup)
app.get("/", (req, res) => {
  res.send("Server Midtrans jalan 🚀");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server jalan di port 3000");
});
