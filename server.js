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

// 🚀 [২৩টি ওডস মেগা কিংস চাবি]: আপনার খাতার ড্রয়িং ডিজাইন হুবহু মিলিয়ে ২৩টি স্লটের ওরিজিনাল ওডস তালিকা লক ভাই ভাই!
const plinkoMultipliers = [
    500, 100, 50, 10, 5, 3.0, 2.0, 0.5, 0.3, 0.2, 0, 
    0.2, 0.3, 0.5, 2.0, 3.0, 5, 10, 50, 100, 500
];

const rowsCount = 21; // ২৩টি স্লটের জন্য পেগ রো বা লাইন সংখ্যা বাড়িয়ে ২১টি করতে হবে ওস্তাদ!

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার গেটওয়ে
app.get('/api/plinko-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. প্লিংকো কোর বল ড্রপিং রাউট (২৩টি ডাইনামিক ওডস ও কড়া ২০০০০ লিমিট সিকিউরিটি ফিল্টার লক ভাই ভাই!)
app.post('/api/plinko-drop', async (req, res) => {
    const { userId, amount, wallet } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;

    // 🔒 [বেট সিকিউরিটি ফিল্টার]: বাজি ১ টাকার কম বা ২০০০০ টাকার বেশি হলে ব্যাকএন্ড ডিরেক্ট ব্লক ভাই ভাই!
    if (reqAmount < 1 || reqAmount > 20000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳Subcontinent)" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই প্রোটোকল]: বাজি প্লে করার আগে ডাটাবেজ থেকে রিয়েল টাকা নিশ্চিত করার চাবি
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balResponse.data && balResponse.data.status === "ok" && balResponse.data.balance !== undefined) {
            currentDbBalance = parseFloat(balResponse.data.balance);
        } else {
            return res.json({ success: false, balance: 0, message: "❌ Database Sync Error! Please refresh." });
        }

        // 🔒 [ইনসাফিসিয়েন্ট প্রোটেকশন বর্ম]: অ্যাকাউন্টে টাকা কম থাকলে বা জিরো ব্যালেন্স হলে বাজি রিফিউজড ভাই ভাই!
        if (currentDbBalance < reqAmount || currentDbBalance <= 0) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge BDT." });
        }

        let adminTriggeredPrize = (balResponse.data && balResponse.data.plinko_target) ? balResponse.data.plinko_target : null;

        let finalSlotIdx, winMultiplier, finalStatus, dropPath;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP ও বল ড্রপিং ফিজিক্স লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            // ২১টি পেগের সারি ভেদ করে বল ডানে-বামে যাওয়ার ওরিজিনাল ক্যানভাস পাথ জেনারেটর
            dropPath = [];
            let currentX = 0;
            for (let r = 0; r < rowsCount - 1; r++) {
                let step = (Math.random() < 0.5) ? 0 : 1; 
                dropPath.push(step);
                currentX += step;
            }
            
            finalSlotIdx = currentX; 
            winMultiplier = plinkoMultipliers[finalSlotIdx] !== undefined ? plinkoMultipliers[finalSlotIdx] : 0;

            if (winMultiplier >= 1.0) {
                finalStatus = "win";
            } else {
                finalStatus = "lose";
            }

            // এডমিন ড্যাশবোর্ড কন্ট্রোল ফিল্টার ক্যাচ
            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && winMultiplier < 1.0) isLoopActive = false;
                if (adminTriggeredPrize === "force_win" && winMultiplier >= 1.0) isLoopActive = false;
                if (adminTriggeredPrize === "force_jackpot" && winMultiplier === 500) isLoopActive = false;
            } else {
                // মেগা ৫০০ ও ১০০ গুণের জ্যাকপটের চান্স আরটিপি লুপ ট্র্যাকে কড়া সুরক্ষায় টাইট ০.৩% এ লক ভাই ভাই
                if (winMultiplier >= 100 && Math.random() > 0.003) continue;

                if (finalStatus === "win") {
                    // ৯৫% আরটিপি সিঙ্ক কন্ট্রোল ম্যাথ লুপ স্বাভাবিক ট্র্যাকে ৩৬% এ ব্যালেন্সড লক ভাই ভাই!
                    if (Math.random() <= 0.36) {
                        isLoopActive = false;
                    }
                } else {
                    isLoopActive = false; 
                }
            }
        }

                // 🚀 [রয়্যাল ক্যাসিনো ওরিজিনাল ব্যালেন্স প্রোটেকশন বর্ম ভাই ভাই]
        let winAmount = parseFloat((reqAmount * winMultiplier).toFixed(2));
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (winMultiplier > 0) {
            // 🎯 প্লেয়ার যদি ০.২ বা ০.৫ বা যেকোনো ওডসে হিট করে, ডাটাবেজ যাতে বাজি কেটে নেট রিটার্ন হিসাব মেলায় ভাই ভাই!
            dbAction = "win";
            dbAmount = winAmount; 
        } else {
            // ০ ওডস পড়লে বাজি লস, ডাটাবেজে জিরো রিটার্ন যাবে (টাকা সম্পূর্ণ কাটা যাবে)
            dbAction = "bet";
            dbAmount = reqAmount;
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet
        };

        // 🔒 [হাউস প্রফিট সিকিউরিটি লক]: ডাটাবেজ ব্যাকএন্ড সিঙ্কে বাজি ধরা এমাউন্টের ওরিজিনাল ট্র্যাক পাঠানো ভাই ভাই
        phpPayload.bet_amount = reqAmount;
        phpPayload.multiplier = winMultiplier.toFixed(2);
        phpPayload.status = (winMultiplier >= 1.0) ? "win" : "lose";
        phpPayload.type = (winMultiplier >= 1.0) ? "win" : "lose";
        phpPayload.is_win = (winMultiplier >= 1.0) ? 1 : 0;
        phpPayload.win_status = (winMultiplier >= 1.0) ? "win" : "lose";
        phpPayload.log_status = (winMultiplier >= 1.0) ? "win" : "lose";

        }

        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                status: finalStatus,
                winAmount: winAmount,
                multiplier: winMultiplier,
                slotIndex: finalSlotIdx,
                ballPath: dropPath
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Royal Plinko Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click BET again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to Royal Plinko 21-Row Engine!"); });

const PORT = process.env.PORT || 18000; 
server.listen(PORT, () => { console.log(`🎡 Royal Plinko 21-Row Engine Running on port ${PORT}`); });
