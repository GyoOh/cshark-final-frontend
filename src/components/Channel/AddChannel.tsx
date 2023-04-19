import React, { useState, useEffect } from 'react'
import {
  Button,
  DialogActions,
  DialogTitle,
  FormControl,
  Stack,
} from '@mui/material'

const button = {
  width: '30%',
  height: 50,
  fontWeight: 'bold',
  borderRadius: 10,
  fontSize: 20,
  borderWidth: 0,
  color: '#111111',
  margin: 20,
}
type User = {
  id: string
  userName: string
  created: Date
}
type Channel = {
  id: string
  name: string
  creatorId: string
  created: Date
}
export default function AddChannel({
  user,
  editChannel,
  setEditChannel,
  channels,
  setChannels,
  setChannelId
}: {
  user: User | null
  editChannel: Channel
  setEditChannel: React.Dispatch<React.SetStateAction<Channel>>
  channels: Channel[]
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>
  setChannelId: React.Dispatch<React.SetStateAction<string>>
}) {
  const [name, setName] = useState('')
  useEffect(() => {
    if (editChannel.id !== '') {
      setName(editChannel.name)
    }
  }, [editChannel])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editChannel.id !== '') {
      const result = await fetch(`api/channels/${editChannel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editChannel.id,
          name,
          creatorId: user?.id,
        }),
      })
      setChannels(
        channels.map((c) => (c.id === editChannel.id ? { ...c, name } : c)),
      )
      setName('')
      setEditChannel({ id: '', name: '', creatorId: '', created: new Date() })
      return
    }
    const result = await fetch(`api/channels/uid/${user?.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, creatorId: user?.id }),
    })
    console.log(result.body)
    setName('')
  }
  return (
    <>
      {editChannel?.id != '' ? (
        <>
          <DialogTitle>Edit Channel </DialogTitle>
          <FormControl
            sx={{ minWidth: 90, marginBottom: '5px', width: '100%' }}
            margin="dense"
          >
            <form onSubmit={handleSubmit}>
    
                <Stack direction={'column'}>
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    style={{ width: '100%' }}
                  >
                    <input
                      value={name}
                      name='name'
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Stack>
                </Stack>
                <button
                  style={button}
                  type='submit'
                  
                >
                  Update
                </button>
  
   
                <button
                  style={button}
                 
                >
                  Cancel
                </button>
               
       
            </form>
          </FormControl>
        </>
      ) : (
        <>
          <h3>New Chat</h3>
          <FormControl
            sx={{ minWidth: 90, marginBottom: '5px', width: '100%' }}
    
          >
            <form onSubmit={handleSubmit}>
   
                <Stack direction={'column'}>
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    style={{ width: '100%' }}
                  >
                    <input
                      value={name}
                      name='name'
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Stack>
                </Stack>
              <DialogActions>
              <button type='submit'>Add</button>
                <button onClick={() => setName('')}>Cancel</button>
              
              </DialogActions>
            </form>
          </FormControl>
        </>
      )}
    </>
  )
}
