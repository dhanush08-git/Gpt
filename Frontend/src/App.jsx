import './App.css';
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import {v1 as uuidv1} from "uuid";

import { MyContext } from './MyContext';
import { useState } from 'react';

function App() {
  const [prompt,setPrompt]=useState("");
  const [reply,setReply] = useState(null); 
  const [currThreadId,setThreadId] = useState(() => uuidv1());
  const [prevChats,setPrevChats]=useState([]); //stores all chats of current thread
  const [newChat,setNewChat] = useState(true);
  const [allThreads,setAllThreads] = useState([]); //stores all threads of the user

  const providerValues = {
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setThreadId,
    newChat,setNewChat,
    prevChats,setPrevChats,
    allThreads,setAllThreads
  }; //passing values
  return (
      <div className="app">
        <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
      </div>
  )
}

export default App
