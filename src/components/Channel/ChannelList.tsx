import React, { useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

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

export default function ChannelList({
  channels,
  setChannelId,
  setEditChannel,
  handleSelectChannelDelete,
  loggedInUser,
  setMessage,
}: {
  channels: Channels
  setChannelId: React.Dispatch<React.SetStateAction<string>>
  setEditChannel: React.Dispatch<React.SetStateAction<Channel>>
  handleSelectChannelDelete: (channel: Channel) => void
  loggedInUser: User
  setMessage: React.Dispatch<React.SetStateAction<string>>
}) {
  const [selectedChannel, setSelectedChannel] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [ishover, setIshover] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(0)
  function handleSelectChannel(index: number, channel: Channel) {
    setChannelId(channel.id)
    if (index !== selectedIndex) {
      setSelectedChannel(true)
      setSelectedIndex(index)
      setMessage('')
    }
  }
  const handleEdit = (channel: Channel) => {
    setEditChannel(channel)
  }
  const handleDlete = (channel: Channel) => {
    handleSelectChannelDelete(channel)
  }

  return (
    <ListGroup variant="flush" style={{ width: '100%' }}>
      <h3>Select Chat</h3>
      {channels.map((channel, idx) => (
        channel.creatorId == loggedInUser?.id && 
        <ListGroup.Item
          key={idx}
          onClick={() => handleSelectChannel(idx, channel)}
          action={selectedChannel && idx === selectedIndex}
          active={selectedChannel && idx === selectedIndex}
          onMouseOver={() => {
            loggedInUser.id == channel.creatorId && setIshover(true)
            return setHoverIndex(idx)
          }}
          onMouseOut={() => setIshover(false)}
        >
          {channel.name}
          <span
            style={{
              float: 'right',
              cursor: 'pointer',
              position: 'absolute',
              maxWidth: 'max-content',
              right: 0,
            }}
          >
            {ishover && hoverIndex == idx && (
              <>
                <EditOutlined
                  style={{ marginRight: 7 }}
                  onClick={() => handleEdit(channel)}
                />
                <DeleteOutlined onClick={() => handleDlete(channel)} />
              </>
            )}
          </span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
