import { useEffect, useState } from 'react'
import './App.css'
import ChatContainer from './components/Chat/ChatContainer'
import { BrowserRouter as Router, Route, useNavigate } from 'react-router-dom';

type Users = Array<{
  id: string
  userName: string
  created: Date
}>


export default function App() {
  const [users, setUsers] = useState<Users>([])
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users')
      if (response.ok) {
        const user = await response?.json()
        setUsers(user)
      }
    }
    fetchUsers()
  }, [])

  return (
    <Router>
    <div
      className="app"
    >
      <ChatContainer users={users} setUsers={setUsers} />
  
    </div>
    </Router>
  )
}
