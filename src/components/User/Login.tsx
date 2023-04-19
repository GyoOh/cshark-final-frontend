import React, { useRef, useState } from 'react'

type Users = Array<{
  id: string
  userName: string
  created: Date
}>
type User = {
  id: string
  userName: string
  created: Date
}

export default function Login({
  users,
  setUsers,
  user,
  setUser,
}: {
  users: Users
  setUsers: React.Dispatch<React.SetStateAction<Users>>
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}) {
  const userRef = useRef<HTMLInputElement>(null)
  const [userName, setUserName] = useState('')
  const [notice, setNotice] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const thisUser = users.find((user) => user.userName === userName)
    e.preventDefault()
    if (!thisUser) {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
        }),
      })
      const data = await response.json()
      setUser(data)
      return
    }
    localStorage.setItem(
      'avatar',
      `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`,
    )
    localStorage.setItem(
      'myAvatar',
      `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`,
    )

    if (thisUser) {
      setUser(thisUser)
      setNotice('Welcome back')
      return
    }
  }

  return (
   
    <>
<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
 
    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
   
  </div>

  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">
          userName
          </label>
          <div className="mt-2">
            <input
              id="userName"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>  
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          
        </div>

        
      </div>
    </div>
  </div>
</div>
</>
  )
}

