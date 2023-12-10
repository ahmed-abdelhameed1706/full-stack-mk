import './App.css'
import Navbar from './components/header/Navbar'
import Header from './components/header/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Footer from './components/footer/Footer'

function App() {


  return (
    <div>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/home" element={<Home />} />
        </Routes>
        <Footer />
      </Router>
      
    </div>
  )
}

export default App
