import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import Chats from './pages/Chats'
import Friends from './pages/Friends'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import Personal from './pages/Personal'
import Group from './pages/Group'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <div className='bg-black'>
      <BrowserRouter>
     
        <Routes>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='/' element={<Layout/>}>
              <Route path='dashboard' element={<Dashboard/>} />
              <Route path='profile' element={<Profile/>} />
              <Route path='chats' element={<Chats/>} />
              <Route path='personal' element={<Personal/>} />
              <Route path='groups' element={<Group/>} />
              <Route path='friends' element={<Friends/>} />
              <Route path='settings' element={<Settings/>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
