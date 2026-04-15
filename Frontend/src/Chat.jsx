import "./Chat.css"
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat(){
    const { prevChats, setPrevChats, reply, setReply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState("");
    const bottomRef = useRef(null);

    // Auto-scroll on new messages or typing update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [prevChats, latestReply]);

    useEffect(() => {
        if (!reply) return;

        setLatestReply("");

        let idx = 0;
        const content = reply.content ?? "";

        const interval = setInterval(() => {
            idx++;
            setLatestReply(content.slice(0, idx));

            if (idx >= content.length) {
                clearInterval(interval);

                setPrevChats(prev => [
                    ...prev,
                    { role: "assistant", content }
                ]);

                setReply(null);
            }
        }, 18);

        return () => clearInterval(interval);

    }, [reply]);

    return (
        <>
            {prevChats.length === 0 && !reply && <h1>Start a new chat....</h1>}

            <div className="chats">

                {prevChats.map((chat, idx) => (
                    <div className={chat.role} key={idx}>
                        <div className={chat.role === "user" ? "usermessage" : "gptmessage"}>
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {chat.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}

                {/* Typing animation */}
                {reply && (
                    <div className="assistant">
                        <div className="gptmessage">
                            {latestReply ? (
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {latestReply}
                                </ReactMarkdown>
                            ) : (
                                <span className="typing-indicator">
                                    <span /><span /><span />
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        </>
    );
}

export default Chat;
