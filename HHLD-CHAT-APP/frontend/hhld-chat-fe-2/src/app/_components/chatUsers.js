import React, { useEffect } from 'react'
import { useUsersStore } from '../zustand/useUserStore'
import { useChatReceiverStore } from '../zustand/useChatReceiver';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import { useAuthStore } from '../zustand/useAuthStore.js';
import axios from 'axios';
const ChatUsers = () => {

    const { users } = useUsersStore();
    const {authName} = useAuthStore();
    const {chatReceiver ,updateChatReceiver} = useChatReceiverStore();
    const {chatMsgs, updateChatMsgs} = useChatMsgsStore();

    useEffect(() => {
        const getMsgs = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:8081/msgs`,
                {
                    params: {
                        'sender': authName,
                        'receiver': chatReceiver
                    }
                },
                {
                    withCredentials: true
                });
            if (res.data.length !== 0) {
                updateChatMsgs(res.data);
            } else {
                updateChatMsgs([]);
            }
        }
        if(chatReceiver) {
            getMsgs();
        }
    }, [chatReceiver])

    const setChatReceiver = (user) => {
        console.log(user);
        updateChatReceiver(user.username);
      }
    
     

    return (
        <div >
        {
            users.map((user, index) => (
                <div key={index} className='bg-slate-400 rounded-xl m-3 p-5'
                onClick={()=> setChatReceiver(user)}
                >

                    {user.username}

                </div>
            ))
        }
        </div>
    )
}

export default ChatUsers