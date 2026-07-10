const newChatBtn = document.getElementById("new-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const savedChats = localStorage.getItem("chatHistory");

if (savedChats) {
    chatBox.innerHTML = savedChats;
}
function saveChat() {
    localStorage.setItem("chatHistory", chatBox.innerHTML);
}

sendBtn.addEventListener("click", sendMessage);

async function sendMessage() {
    chatBox.scrollTop =
    chatBox.scrollHeight;
    const message = userInput.value;

    if (message === "") {
        return;
    }

    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.innerHTML = `
<div class="message">
    <span class="avatar">👤</span>
    <span>${message}</span>
</div>
`;

    chatBox.appendChild(userMessage);
    saveChat();
    const typing = document.createElement("div");
typing.classList.add("ai-message");
typing.innerHTML = `
<div class="typing">
    <span></span>
    <span></span>
    <span></span>
</div>
`;
chatBox.appendChild(typing);

setTimeout(async function () {
    let reply;

try {
    reply = await getAIResponse(message);
} catch (error) {
    reply = "❌ " + error.message;
}

typing.remove();


    const aiMessage = document.createElement("div");
    aiMessage.classList.add("ai-message");
    aiMessage.innerHTML = `
<div class="message">
    <span class="avatar">🤖</span>
    <div>${marked.parse(reply)}</div>
</div>
`;

    chatBox.appendChild(aiMessage);
    saveChat();

    chatBox.scrollTop = chatBox.scrollHeight;
}, 1000);




    userInput.value = "";
    userInput.focus();
}
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
async function getAIResponse(message) {
    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(data.error?.message || "Request failed");
        }


        return data.reply;


    } catch (error) {
        console.error(error);
        return "❌ Error: " + error.message;
    }
}
newChatBtn.addEventListener("click", function () {
    chatBox.innerHTML = "";
    localStorage.removeItem("chatHistory");
});





