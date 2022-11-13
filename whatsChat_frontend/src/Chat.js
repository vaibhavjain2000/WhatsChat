import {Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import React, { useState } from 'react'
import './Chat.css'
import axios from './axios'

function Chat({ messages }) {

  const [input,setInput] = useState("")
  const sendMessage = async (e)=>{
    e.preventDefault()
    await axios.post("messages/new",{
        message: input,
        name: "user",
        timestamp: new Date().toUTCString(),
        received: false
    })
    setInput("")
  }
  return (
    <div className='chat'> 
      <div className="chat_header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>Room Name</h3>
          <p>Last seen at...</p>
        </div>
        <div className="chat_headerRight">
            <IconButton>
                <SearchOutlinedIcon />
            </IconButton>
            <IconButton>
                <AttachFileIcon />
            </IconButton>
            <IconButton>
                <MoreVertIcon />
            </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message)=>(
            <p className={`chat_message ${!message.received && "chat_receiver"}`}> 
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestamp">{message.timestamp}</span>
            </p>
          
        ))}
      </div>
      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input
           value ={input} 
           onChange = {e => setInput(e.target.value)}
           type="text" 
           placeholder="Type a message" />
          <button onClick={sendMessage} type = "submit">Send a message</button>
        </form>
        <MicIcon />
      </div>
    </div>
  )
}

export default Chat
