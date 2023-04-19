import React, { useState, useEffect } from 'react'
import { Avatar, Image } from 'antd'
import ReactTimeAgo from 'react-time-ago'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import '../../App.css'
type Message = {
  id: string
  text: string
  userName: string
  created: Date
  channelId: string
  userId: string
}
type User = {
  id: string
  userName: string
  created: Date
}

export default function ChatBoxReceiver({
  user,
  avatar,
  message,
  time,
  setEditMessage,
  handleMessageDelete,
  loggedInUser,
  resultRef,
}: {
  user: string
  avatar: string
  message: Message
  time: Date
  setEditMessage: React.Dispatch<React.SetStateAction<Message>>
  handleMessageDelete: (message: Message) => void
  loggedInUser: User
  resultRef: React.RefObject<HTMLDivElement>
}) {
  const [isHover, setIsHover] = useState(false)
  const handleEdit = () => {
    setEditMessage(message)
  }
  const handleDlete = (message: Message) => {
    handleMessageDelete(message)
  }
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

  useEffect(() => {
    // Scroll to the bottom of the chat box when the resultRef changes
    if (resultRef && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [resultRef])
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}
        onMouseOver={() => {
          message.userId == loggedInUser?.id && setIsHover(true)
        }}
        onMouseOut={() => setIsHover(false)}
      >
             
        <Avatar
          size={50}
          src={
            <Image
              src={avatar}
              style={{
                objectFit: 'cover',
                width: '45',
                height: '45',
              }}
              preview={false}
            />

          }
          
        />
            <strong style={{ fontSize: 13 }}>{user}</strong>

  
        <div style={{ pointerEvents: 'none' }}>
       
          <p
            ref={resultRef}
            style={{
           
              padding: 10,
              backgroundColor: '#e6e6e6',
              borderRadius: 10,
              width: 'auto',
              marginLeft: 5,
              maxWidth: 'max-content',
            }}
          >
           
            {message.text}
           
          </p>
         
          
        </div>
        <ReactTimeAgo
          date={time}
          locale="en-US"
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            color: 'gray',
            fontSize: '0.8rem',
            paddingLeft: 5,
            // paddingTop: 20,
          }}
        />

        {isHover && (
          <span >
            <EditOutlined style={{ paddingRight: 5 }} onClick={handleEdit} />
            <DeleteOutlined onClick={() => handleDlete(message)} />
          </span>
        )}
      </div>

     
    </div>
  )
}

export function ChatBoxSender({
  user,
  avatar,
  message,
  time,
  setEditMessage,
  handleMessageDelete,
  loggedInUser,
  resultRef,
}: {
  user: string
  avatar: string
  message: Message
  time: Date
  setEditMessage: React.Dispatch<React.SetStateAction<Message>>
  handleMessageDelete: (message: Message) => void
  loggedInUser: User
  resultRef: React.RefObject<HTMLDivElement>
}) {
  const [isHover, setIsHover] = useState(false)
  const handleEdit = () => {
    setEditMessage(message)
  }
  const handleDlete = (message: Message) => {
    handleMessageDelete(message)
  }
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

  useEffect(() => {
    // Scroll to the bottom of the chat box when the resultRef changes
    if (resultRef && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [resultRef])

  return (
    <><div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        width: '100%',
        overflowY: 'scroll',
      }}
      onMouseOver={() => {
        return message.userId == loggedInUser?.id ? setIsHover(true) : null
      } }
      onMouseOut={() => {
        return message.userId == loggedInUser?.id ? setIsHover(false) : null
      } }
    >
       <Avatar
                size={50}
                src={
                    <Image
                        src={avatar}
                        style={{
                            objectFit: 'cover',
                            width: '45',
                            height: '45',
                        }}
                        preview={false}
                    />
                }
            />
      <div style={{ pointerEvents: 'none' }}>
        <p
          ref={resultRef}
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            paddingRight: 30,
            paddingLeft: 10,
            backgroundColor: '#fff',
            borderRadius: 10,
            maxWidth: 'max-content',
            marginLeft: 5,
          }}
        >
          <strong style={{ fontSize: 13 }}>{user}</strong>
          <br></br>
          {message.text}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          position: 'relative',
          paddingLeft: 5,
        }}
      >

        {isHover && (
          <span>
            <EditOutlined style={{ paddingRight: 5 }} onClick={handleEdit} />
            <DeleteOutlined onClick={() => handleDlete(message)} />
          </span>
        )}
        {windowSize.width < 850 && (
          <span style={{ position: 'absolute', top: 0, right: 0 }}>
            <EditOutlined style={{ paddingRight: 5 }} onClick={handleEdit} />
            <DeleteOutlined onClick={() => handleDlete(message)} />
          </span>
        )}

      </div>

    </div><ReactTimeAgo
        date={time}
        locale="en-US"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          color: 'gray',
          fontSize: '0.8rem',
          paddingLeft: 5,
          // paddingTop: 20,
        }} /></>
  )
}
