import { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js'
import axios from './axios' 

function App() {

  const [messages , setMessages] = useState([])
  useEffect(()=>{
    axios.get('/messages/sync')
      .then(response => {
        setMessages(response.data)
      },[messages])
  })
  useEffect(()=>{
    const pusher = new Pusher('88139ab431fd0a295fd3', {
      cluster: 'ap2'
    },);

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessages)=>{
      alert(JSON.stringify(newMessages));
      setMessages(...messages, newMessages)
    });
    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[messages])

  // console.log(messages)
  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <Chat messages = {messages} />
      </div>
    </div>
  );
}

export default App;
