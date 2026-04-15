import 'dotenv/config';

const getOpenAIAPIResponse = async(messages) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messages   // send full conversation
        })
    };

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            options
        );

        const data = await response.json();

        return data?.choices?.[0]?.message || {
            role: "assistant",
            content: "No response"
        };

    } catch (err) {
        console.log(err);
    }
};

export default getOpenAIAPIResponse;