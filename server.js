require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/chat", async (req, res) => {
    try {
        console.log("API key loaded:", process.env.OPENROUTER_API_KEY ? "YES" : "NO");
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat-v3-0324",
                max_tokens: 500,
                messages: [
                    {
                        role: "user",
                        content: req.body.message
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
    console.log("OpenRouter Error:", data);
    return res.status(response.status).json(data);
}

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
app.get("/", (req, res) => {
    res.send("Hello! My server is working.");
});
const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
