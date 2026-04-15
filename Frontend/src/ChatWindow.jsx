import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import Loader from "./Loader.jsx";

function ChatWindow(){
    const { prompt, setPrompt, setReply, currThreadId, setPrevChats } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const getReply = async () => {
        if (!prompt.trim() || loading) return;

        const userMessage = { role: "user", content: prompt };
        const currentPrompt = prompt;

        setPrompt("");
        setLoading(true);

        // Optimistic: show user message immediately
        setPrevChats(prev => [...prev, userMessage]);

        try {
            const response = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                 },
                body: JSON.stringify({ message: currentPrompt, threadId: currThreadId }),

            });

            if (!response.ok) throw new Error("API error");

            const res = await response.json();
            setReply(res);

        } catch (err) {
            console.log(err);
            setPrevChats(prev => [
                ...prev,
                { role: "assistant", content: "Something went wrong. Please try again." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatwindow">
            <div className="navbar">
                <span>Gpt<i className="fa-solid fa-arrow-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-regular fa-user"></i></span>
                </div>
                  {
                    isOpen && 
                    <div className="dropdown">
                        <div className="dropDownItem">{username || 'Guest'}</div>
                        {/* <div className="dropDownItem"><i className="fa-solid fa-gear"></i>Settings</div> */}
                        <div className="dropDownItem" onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('username');
                            window.location.href = "/login";
                        }}><i className="fa-solid fa-sign-out"></i>Logout</div>
                    </div>
                }

            </div>
         
            <Chat />

            {loading && (
                <div style={{ marginTop: "20px" }}>
                    <Loader />
                </div>
            )}

            <div className="chatInput">
                <div className="inputbox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && getReply()}
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">can make mistakes....</p>
            </div>
        </div>
    );
}

export default ChatWindow;
