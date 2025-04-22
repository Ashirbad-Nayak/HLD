"use client"
import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import { useAuthStore } from '../zustand/useAuthStore';
import axios from 'axios';
import { useUsersStore } from '../zustand/useUserStore';
import ChatUsers from '../_components/chatUsers';
import { useChatReceiverStore } from '../zustand/useChatReceiver';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore.js';


const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [msg, setMsg] = useState('');
    const { authName } = useAuthStore();
    const { updateUsers } = useUsersStore();
    const { chatReceiver } = useChatReceiverStore();
    const { chatMsgs, updateChatMsgs } = useChatMsgsStore();

    useEffect(() => {
        // Establish WebSocket connection
        const newSocket = io(`${process.env.NEXT_PUBLIC_BE_HOST}:8080`, {
            query: {
                username: authName  //so that be can store a map of username and socket
            }
        });
        setSocket(newSocket);

        // Listen for incoming msgs
        newSocket.on('chat msg', msg => {
            console.log('received msg on client ');
            console.log(msg);
            updateChatMsgs(prev=>[...prev, msg]);

        });

        getUserData();
        // Clean up function
        return () => newSocket.close();
    }, []);
   
    const SendMessage = (e) => {
        e.preventDefault();
        if (socket) {
            const msgToBeSent = {
                text: msg,
                sender: authName,
                receiver: chatReceiver
            }
            socket.emit('chat msg', msgToBeSent);
            //console.log("setting message");
            updateChatMsgs(prev=>[...prev, msgToBeSent]);
            setMsg('');
        }
    }

    const getUserData = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:5001/users`,
            {
                withCredentials: true
            })
        console.log(res.data);
        updateUsers(res.data);

    }


    return (
        <div className='h-screen flex divide-x-4 divide-gray-200'>
            <div className=' w-1/5'>
                <ChatUsers />
            </div>
            <div className='w-4/5  flex-col'>
                {chatMsgs &&
                    <h1>
                        {authName} Chatting with {chatReceiver}
                    </h1>}
                {chatMsgs && <div className='msgs-container h-4/5'>
                    {chatMsgs.map((msg, index) => (
                        <div key={index} className={` m-3 ${msg.sender == authName ? 'text-right' : 'text-left'}`}>
                            <span className={`${msg.sender == authName ? 'bg-blue-200' : 'bg-green-200'} p-3 rounded-lg`}>
                                {msg.text}
                            </span>
                        </div>
                    ))}
                </div>}
                <div className='h-1/5 flex items-center justify-center'>
                    <form onSubmit={SendMessage} className="w-1/2">
                        <div className="relative">
                            <input type="text"
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                placeholder="Type your text here"
                                required
                                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <button type="submit"
                                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default Chat