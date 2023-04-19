import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import Iconify from './Iconify'
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  Stack,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import '../../App.css'

type User = {
  id: number
  userName: string
  created: Date
}
type Channel = {
  id: number
  name: string
  creatorId: number
  created: Date
}
type Message = {
  id: number
  text: string
  userName: string
  created: Date
  channelId: number
  userId: number
}

export default function AddMessage({
  user,
  channel,
  channelId,
  editMessage,
  setEditMessage,
  messages,
  setMessages,
  resultRef,
  message,
  setMessage,
}: {
  user: User
  channel: Channel
  channelId: number
  editMessage: Message
  setEditMessage: React.Dispatch<React.SetStateAction<Message>>
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  resultRef: React.RefObject<HTMLDivElement>
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
}) {
  const [shadow, setShadow] = useState(false)
  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true)
      } else {
        setShadow(false)
      }
    }
    window.addEventListener('scroll', handleShadow)
  }, [])
  useEffect(() => {
    if (editMessage && editMessage.id !== 0) {
      setMessage(editMessage.text)
    }
  }, [editMessage])
  const addMessage = async (message: string) => {
    resultRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (editMessage.id !== 0) {
      const result = await fetch(`/api/messages/${editMessage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editMessage.id,
          text: message,
          userName: editMessage.userName,
          created: editMessage.created,
          userId: Number(editMessage.userId),
          channelId: Number(editMessage.channelId),
        }),
      })
      setMessages(
        messages.map((m) => {
          if (m.id === editMessage.id) {
            return {
              ...m,
              text: message,
            }
          }
          return m
        }),
      )
      setEditMessage({
        id: 0,
        text: '',
        userName: '',
        created: new Date(),
        channelId: 0,
        userId: 0,
      })
      return
    }
    const result = await fetch(
      `/api/messages/cid/${channelId}/uid/${user.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          userName: user?.userName,
          userId: Number(user?.id),
          channelId: Number(channelId),
        }),
      },
    )
    return
  }
  const queryClient = useQueryClient()
  const { mutate } = useMutation(addMessage, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('messages')
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(message)
    setMessage('')
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

  return (
    <div
      style={{
        width: '75%',
        display: 'flex',
        flexDirection: shadow ? 'column' : 'row',
        justifyContent: 'flex-end',
        position: shadow ? 'relative' : 'absolute',
        bottom: '0',
        marginTop: '2rem'
      }}
    >
      {editMessage && editMessage?.id !== 0 ? (
        <FormControl
          sx={{
            minWidth: 90,

            marginBottom: '5px',
            width: '100%',
          }}
          margin="dense"
          variant="standard"
        >
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Stack direction={'column'}>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  style={{ width: '100%' }}
                >
                  <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    label="Message"
                    value={message}
                    variant="standard"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMessage(editMessage.text)}>
                Cancel
              </Button>
              <LoadingButton type="submit" disabled={message === ''}>
                {!channelId ? <Iconify icon="akar-icons:check" /> : 'Edit'}
              </LoadingButton>
            </DialogActions>
          </form>
        </FormControl>
      ) : (
        <FormControl
          sx={{ minWidth: 90, marginBottom: '5px', width: '100%' }}
          margin="dense"
          variant="standard"
        >
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Stack direction={'column'}>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  style={{ width: '100%' }}
                >
                  <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    label="Message"
                    value={message}
                    variant="standard"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMessage('')}>Cancel</Button>
              <LoadingButton type="submit" disabled={message === ''}>
                {!channelId ? <Iconify icon="akar-icons:check" /> : 'Send'}
              </LoadingButton>
            </DialogActions>
          </form>
        </FormControl>
      )}
    </div>
  )
}
