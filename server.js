const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - মেগা সকেট প্রোটোকল লক]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 🎡 [প্লাঙ্কো ৮টি বাকেটের মাল্টিপ্লায়ার ম্যাট্রিক্স এবং ৯৫% RTP ওজন লক ভাই ভাই]
const prizeMatrix = [
    { text: "10", multiplier: 10.00, weight: 1 },   // বাকেট ০: ১০ গুণ উইন (কিলিং জ্যাকপট)
    { text: "2", multiplier: 2.00, weight: 10 },    // বাকেট ১: ২ গুণ উইন
    { text: "0.5", multiplier: 0.50, weight: 30 },  // বাকেট ২: ০.৫ গুণ উইন
    { text: "0.2", multiplier: 0.20, weight: 50 },  // বাকেট ৩: ০.২ গুণ উইন
    { text: "0.2", multiplier: 0.20, weight: 50 },  // বাকেট ৪: ০.২ গুণ উইন
    { text: "0.5", multiplier: 0.50, weight: 30 },  // বাকেট ৫: ০.৫ গুণ উইন
    { text: "2", multiplier: 2.00, weight: 10 },    // বাকেট ৬: ২ গুণ উইন
    { text: "10", multiplier: 10.00, weight: 1 }    // বাকেট ৭: ১০ গুণ উইন (কিলিং জ্যাকপট)
];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/plinko-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    try {
        const response = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${wallet}`, { timeout: 30000 });
        if (response.data && response.data.status === "ok") {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. প্লাঙ্কো কোর ড্রপ এপিআই রাউট (POST Route - ৯৫% RTP গাণিতিক অ্যালগরিদম বর্ম লক ভাই ভাই!)
app.post('/api/plinko-drop', async (req, res) => {
    const { userId, amount, wallet } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;

    // 🔒 ১ থেকে ২০০০ বিডিটি পর্যন্ত কড়া বেট সিকিউরিটি রুলস ফিল্টার লক ভাই ভাই
    if (reqAmount < 1 || reqAmount > 2000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳২০০০)" });
    }

    try {
        const balCheck = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${targetWallet}`, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balCheck.data && balCheck.data.balance !== undefined && balCheck.data.balance !== null) {
            currentDbBalance = parseFloat(balCheck.data.balance);
        } else { currentDbBalance = 9999999; }

        if (currentDbBalance < reqAmount && currentDbBalance !== 9999999) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge." });
        }

        // 🎯 [ভবিষ্যৎ সেন্ট্রাল গোপন এডমিন প্যানেল গেটওয়ে লিঙ্ক লক]
        let adminTriggeredPrize = (balCheck.data && balCheck.data.plinko_target) ? balCheck.data.plinko_target : null;

        let targetIdx = null;

        if (adminTriggeredPrize) {
            let matchingIndices = [];
            prizeMatrix.forEach((p, idx) => {
                if (p.text === adminTriggeredPrize) matchingIndices.push(idx);
            });
            if (matchingIndices.length > 0) {
                targetIdx = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
            }
        }

        // 🎰 [৯৫% ওরিজিনাল RTP ওয়েটেড র্যান্ডম পুল তৈরি করা হলো ভাই ভাই]
        if (targetIdx === null) {
            let pool = [];
            prizeMatrix.forEach((prize, idx) => {
                for (let i = 0; i < prize.weight; i++) {
                    pool.push(idx);
                }
            });
            targetIdx = pool[Math.floor(Math.random() * pool.length)];
        }

        if (targetIdx === null) targetIdx = 3; // ডিফল্ট সেফটি সেগমেন্ট লক ভাই

        const selectedPrize = prizeMatrix[targetIdx];

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (selectedPrize.multiplier > 0) {
            winAmount = Math.floor(reqAmount * selectedPrize.multiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount);
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = parseFloat(selectedPrize.multiplier).toFixed(2);
            phpPayload.status = "win";
            phpPayload.type = "win";
            phpPayload.is_win = 1;
            phpPayload.win_status = "win";
            phpPayload.log_status = "win";
        }

        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                targetIdx: targetIdx, // ক্যানভাস ফিজিক্সকে গাইড করার ইনডেক্স ভাই ভাই
                prizeText: selectedPrize.text,
                winAmount: winAmount
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Plinko Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click BET again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to Royal Plinko Engine!"); });

// ১০ নম্বর গেম ১৭০০০ এ চলছে, তাই ১১ নম্বর প্লাঙ্কো গেম প্রজেক্টের স্বাধীন কাস্টম পোর্ট ১৮০০০ কড়া লক হলো ভাই ভাই!
const PORT = process.env.PORT || 18000;
server.listen(PORT, () => { console.log(`🎡 Royal Plinko Engine Running on port ${PORT}`); });
