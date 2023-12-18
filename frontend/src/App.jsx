import './App.css'
import Navbar from './components/header/Navbar'
import Header from './components/header/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Footer from './components/footer/Footer'
import AllRooms from './pages/roomlist/AllRooms'
import Room from './pages/room/Room'
import CreateOrJoin from './pages/createorjoin/CreateOrJoin'
import MyRooms from './pages/user/MyRooms'
import { useLocation } from 'react-router-dom'

function App() {


  


  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Header />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore-rooms" element={<AllRooms />} />
          <Route path="/room/:roomCode" element={<Room />} />
          <Route path="/create-or-join" element={<CreateOrJoin />} />
          <Route path="/my-rooms" element={<MyRooms />} />
        </Routes>
        <Footer />
      </Router>
      
    </div>
  )
}

export default App
