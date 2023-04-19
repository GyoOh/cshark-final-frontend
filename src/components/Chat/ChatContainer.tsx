import React, { useState, useEffect, useRef } from 'react'
import useSignalR from '../../useSignalR'
import ChatBoxReceiver from '../Message/ChatBox'
import '../../App.css'
import Login from '../User/Login'
import { useQuery } from 'react-query'
import Sidebar from '../Sidebar'
type Message = {
  id: string
  text: string
  userName: string
  created: Date
  channelId: string
  userId: string
}
type Channels = Array<{
  id: string
  name: string
  created: Date
  creatorId: string
}>
type Channel = {
  id: string
  name: string
  created: Date
  creatorId: string
}

type User = {
  id: string
  userName: string
  created: Date
}

export default function ChatContainer({
  users,
  setUsers,
}: {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}) {
  const { connection } = useSignalR('/r/chat')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [channel, setChannel] = useState<Channel>({
    id: '',
    name: '',
    created: new Date(),
    creatorId: '',
  })
  const [editChannel, setEditChannel] = useState<Channel>({
    id: '',
    name: '',
    created: new Date(),
    creatorId: '',
  })
  const [editMessage, setEditMessage] = useState<Message>({
    id: '',
    text: '',
    userName: '',
    created: new Date(),
    channelId: '',
    userId: '',
  })

  const [user, setUser] = useState<User>({
    id: '',
    userName: '',
    created: new Date(),
  })

  const [avatar, setAvatar] = useState(
    localStorage.getItem('avatar') ||
      `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`,
  )
  const [myAvatar, setMyAvatar] = useState(
    localStorage.getItem('myAvatar') ||
      `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`,
  )

  const [channelId, setChannelId] = useState('')

  const resultRef = useRef(null)

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data, isLoading, error } = useQuery('messages', () => {
    return fetch('/api/messages').then((res) => res.json())
  })
  useEffect(() => {
    if (data) {
      setMessages(data)
    }
  }, [data])

  useEffect(() => {
    const fetchChannels = async () => {
      const response = await fetch('/api/channels')
      const channels = await response?.json()
      setChannels(channels)
      setChannelId(channels[0]?.id )
    }
    const fetchMessages = async () => {
      const response = await fetch('/api/messages')
      const messages = await response?.json()
      setMessages(messages)
    }
    fetchChannels()
    fetchMessages()
  }, [])

  useEffect(() => {
    if (!connection) {
      return
    }
    // Only listen for messages coming from a certain chat room
    connection.invoke('AddToGroup', '1')

    // listen for messages from the server
    connection.on('ReceiveMessage', (message) => {
      console.log('message from the server', message)
      message.created = new Date(message.created)
      if (message.userName) {
        setUsers((users) => [...users, message])
      }
      if (message.name) {
        setChannelId(message.id)
        setChannels((channels) => [...channels, message])
      }
      if (message.text) {
        setMessages((messages) => [...messages, message])
      }
    })

    return () => {
      connection.invoke('RemoveFromGroup', '1')
      connection.off('ReceiveMessage')
    }
  }, [connection])

  const chatList = (user: User) => {
    return messages?.map((message, index) => {
      if (message.channelId == channelId) {
        if (message.userId === user.id) {
          return (
            
            <ChatBoxReceiver
              resultRef={resultRef}
              handleMessageDelete={handleMessageDelete}
              key={index}
              user={message.userName}
              message={message}
              avatar={avatar}
              time={message.created}
              setEditMessage={setEditMessage}
              loggedInUser={user}
            />
          )
        }
      }
    })
  }
  const handleSelectChannelDelete = (channel: Channel) => {
    const result = window.confirm(
      'Are you sure you want to delete this channel?',
    )
    if (result) {
      const deleteChannel = async () => {
        const response = await fetch(`/api/channels/${channel.id}`, {
          method: 'DELETE',
        })
        const channels = await response.json()
        setChannels(channels)
      }
      deleteChannel()
      setChannels((channels) => channels.filter((c) => c.id != channel.id))
      return
    }
  }
  const handleMessageDelete = (message: Message) => {
    const result = window.confirm(
      'Are you sure you want to delete this message?',
    )
    if (result) {
      const deleteMessage = async () => {
        const response = await fetch(`/api/messages/${message.id}`, {
          method: 'DELETE',
        })
        const messages = await response.json()
        setMessages(messages)
      }
      deleteMessage()
      setMessages((messages) => messages.filter((m) => m.id !== message.id))
      return
    }
  }
  useEffect(() => {
    if (editMessage && editMessage.id !== '') {
      setMessage(editMessage.text)
    }
  }, [editMessage])

  return (
    <>
      {user.userName ? (
     
        <>
      
        <Sidebar avatar={avatar} user={user}
        editChannel={editChannel}
        setEditChannel={setEditChannel}
        channels={channels}
        setChannels={setChannels}
                setMessage={setMessage}
                message={message}
                messages={messages}
                setMessages={setMessages}
                channel={channel}
                channelId={channelId}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                resultRef={resultRef} 
                chatList={chatList}
                setChannelId={setChannelId}
                handleSelectChannelDelete={handleSelectChannelDelete}
                setUser={setUser}
                />
        </>
      ) : (
        <Login
          users={users}
          setUsers={setUsers}
          user={user}
          setUser={setUser}
        />
      )}
    </>
  )
}
