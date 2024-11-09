import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import UserCredentials from './pages/UserCredentials'
import ChatPage from './pages/ChatPage'
import Chat from './pages/Chat'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<UserCredentials/>} />
      <Route path="/chat" element={<ChatPage/>} />
      <Route path="/chat2" element={<Chat/>} />
      
    </Route>
  )
)

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App