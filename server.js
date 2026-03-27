const express = require("express");
const cors = require("cors");
const midtransClient = require("midtrans-client");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 PRODUCTION MODE
const snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: "Mid-server-F3oeO-e1yRZzP2L8qc15t1j6"
});

app.post("/create-order", async (req, res) => {
  try {
    const {
      order_id,
      gross_amount,
      member,
      wa,
      payment_method
    } = req.body;

    if (!order_id || !gross_amount) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    let parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount
      },
      customer_details: {
        first_name: member || "User",
        phone: wa || ""
      }
    };

    // 🔥 FIX: DIRECT METHOD (biar gak muncul pilihan lagi)
    switch (payment_method) {

      case "qris":
        parameter.payment_type = "qris";
        break;

      case "gopay":
        parameter.payment_type = "gopay";
        break;

      case "bni":
        parameter.payment_type = "bank_transfer";
        parameter.bank_transfer = { bank: "bni" };
        break;

      case "bri":
        parameter.payment_type = "bank_transfer";
        parameter.bank_transfer = { bank: "bri" };
        break;

      case "permata":
        parameter.payment_type = "bank_transfer";
        parameter.bank_transfer = { bank: "permata" };
        break;

      case "mandiri":
        parameter.payment_type = "echannel";
        parameter.echannel = {
          bill_info1: "Kas Alumni",
          bill_info2: "Pembayaran"
        };
        break;

      default:
        // fallback (kalau error dari frontend)
        parameter.enabled_payments = [
          "qris",
          "gopay",
          "bank_transfer",
          "echannel"
        ];
    }

    const transaction = await snap.createTransaction(parameter);

    res.json({
      token: transaction.token
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Gagal buat transaksi" });
  }
});

app.get("/", (req, res) => {
  res.send("Server Midtrans aktif 🚀");
});

app.listen(3000, () => {
  console.log("Server jalan di port 3000");
});  } catch (err) {
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
