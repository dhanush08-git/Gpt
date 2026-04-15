import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";
import API from "./api.js";

function Sidebar(){
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setThreadId, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {
       try {
            const response = await fetch(`${API}/api/thread`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch threads");

        const res = await response.json();

        setAllThreads(
            res.map(t => ({
                threadId: t.threadId,
                title: t.title
            }))
        );

        } catch(err) {
        console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setReply(null);
        setPrompt("");
        setThreadId(newThreadId);
        try {
            const response = await fetch(`${API}/api/thread/${newThreadId}`, {
            headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
            const messages = await response.json();
            setPrevChats(Array.isArray(messages) ? messages : []);
        } catch(err) {
            console.log(err);
            setPrevChats([]);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${API}/api/thread/${threadId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log(response);
            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            //if deleted thread is current thread, then create new chat
            if(threadId === currThreadId) {
                createNewChat();
            }
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/logo2.PNG" alt="" className="logo"/>
                <span><i className="fa-regular fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li key={idx} onClick={() => changeThread(thread.threadId)}
                    className={thread.threadId === currThreadId ? "highlighted" : ""}>
                        {thread.title}
                        <i className="fa-solid fa-trash" onClick={(e) => {e.stopPropagation();
                        deleteThread(thread.threadId);
                        }}></i>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>By finixx</p>
            </div>
        </section>
    );
}

export default Sidebar;
