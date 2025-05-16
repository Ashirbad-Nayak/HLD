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
            updateChatMsgs(prev => [...prev, msg]);

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
            updateChatMsgs(prev => [...prev, msgToBeSent]);
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
        <div className="h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/5 bg-white border-r shadow-sm p-4 overflow-y-auto">
                <ChatUsers />
            </div>

            {/* Main Chat Area */}
            <div className="w-4/5 flex flex-col bg-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-200 to-amber-700 text-white px-6 py-4 shadow flex justify-between items-center text-sm sm:text-base font-medium">
                    <div>
                        Chatting with: <span className="font-semibold">{chatReceiver}</span>
                    </div>
                    <div className="text-right">
                        You: <span className="font-semibold">{authName}</span>
                    </div>
                </div>


                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 bg-gray-50">
                    {chatMsgs &&
                        chatMsgs.map((msg, index) => {
                            const isSender = msg.sender === authName;
                            return (
                                <div
                                    key={index}
                                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`rounded-2xl p-3 max-w-[60%] text-sm leading-relaxed shadow ${isSender
                                            ? 'bg-amber-500 text-white rounded-br-none'
                                            : 'bg-amber-100 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white">
                    <form onSubmit={SendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Type a message..."
                            required
                            className="flex-1 px-4 py-3 rounded-full border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className="bg-amber-700 text-white px-5 py-2 rounded-full hover:bg-gray-300 transition"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default Chat