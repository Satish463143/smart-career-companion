require("dotenv").config();

const generateAiResponse = async (userId, message) => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
                "Content-Type": "application/json"
            },
            
            body: JSON.stringify({
                "model": "google/gemini-2.5-flash-lite",
                "messages": [
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            })
        });
        console.log("OpenRouter API Key:", process.env.OPENROUTER_API_KEY );

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            console.error("OpenRouter API Error:", data);
            throw new Error("Failed to get response from AI");
        }

    } catch (error) {
        console.log("AI Service Error:", error);
        throw error;
    }
};

module.exports = generateAiResponse;