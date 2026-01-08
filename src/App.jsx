import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import Revamp from './page/Revamp'
import Native from './page/Native'
import Beauty from './page/Beauty'
import WallMakeover from './component/WallMakeover'
import InstaHelpPage from './component/InstaHelpPage'
import Purchase from './component/Purchase'
import Electrician from './component/Electrician'
import Carpanter from './component/Carpanter'
import Laptop from './component/Laptop'
import Detail from './component/Detail'
import Checkout from './component/Checkout'
import Modal from './component/Model'
import HelpPage from './component/HelpPage'
import MyBookingsPage from './component/MyBookingPage'
import AccountPage from './component/AccountPage'
import CardPage from './component/CardPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/revamp" element={<Revamp />} />
        <Route path="/native" element={<Native />} />
        <Route path="/beauty" element={<Beauty />} />
        <Route path="/wallmakeover" element={<WallMakeover />} />
        <Route path="/instahelp" element={<InstaHelpPage />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/electrician" element={<Electrician />} />
        <Route path="/carpanter" element={<Carpanter />} />
        <Route path="/laptop" element={<Laptop />} />
        <Route path="/service/:serviceName/:serviceId" element={<Detail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/model" element={<Modal />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path='/booking' element={<MyBookingsPage />} />
        <Route path='/booking/:bookingId' element={<MyBookingsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/cart" element={<CardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
