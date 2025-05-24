const {
  BakongKHQR,
  khqrData,
  IndividualInfo
} = require("bakong-khqr");
const axios = require('axios');
const express = require('express');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const port = 3000;
let md5_check = "";

app.use(express.static(path.join(__dirname, 'public')));

app.get('/pay',async (req,res) => {
    try{
        // Prepare QR info
        const optionalData = {
        currency: khqrData.currency.usd,
        amount: 0.1,
        mobileNumber: "85586294990",
        storeLabel: "SkillBloom",
        terminalLabel: "Cashier_1",
        };
        const individualInfo = new IndividualInfo(
        "peng_lykhim@aclb",
        "Peng Lykhim",
        "PHNOM PENH",
        optionalData
        );

        const KHQR = new BakongKHQR();
        const individual = KHQR.generateIndividual(individualInfo);

        const qr = individual.data.qr;
        const md5 = individual.data.md5;
        md5_check = md5;

        console.log("qr:", qr);
        console.log("md5:", md5);

        const qrImage = await QRCode.toDataURL(qr);
        const amount = optionalData.amount;
        res.json({ qr: qrImage , amount: amount });
    } catch (error) {
        console.error('Error generating QR:', error);
        res.status(500).send('Error generating QR');
    }
})

// Correct API Endpoint
const baseUrl = "https://api-bakong.nbc.gov.kh";
const endpoint = `${baseUrl}/v1/check_transaction_by_md5`;

//  Make POST request to check transaction
// axios.post(endpoint,
//   { md5_check },
//   {
//     headers: {
//       Authorization: `Bearer process.env.BEARER_TOKEN`, 
//       'Content-Type': 'application/json',
//     },
//   }
// ).then(response => {
//   console.log("Payment Status Response:", response.data);
//     if (response.data?.responseCode === 0) {
//     console.log("Transaction PAID");
//   } else {
//     console.log("Transaction NOT paid:", response.data.responseMessage);
//   }

// }).catch(error => {
//   console.error("Error:", error.response?.data || error.message);
// });

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
})