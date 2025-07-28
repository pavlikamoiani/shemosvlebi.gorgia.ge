import { React } from 'react'
import { Provider } from 'react-redux'
import store from './store/store'
import Dashboard from './page/dashboard/Dashboard'
import { Route, Routes, BrowserRouter, } from 'react-router-dom'
import UserPanel from './page/userPanel/UserPanel'
import Branches from './page/branch/Branch'
import LoginModal from './components/LoginModal'
import TopNavbar from './components/TopNavbar'


function App() {
  return (
    <Provider store={store}>
      <div style={{ margin: '0 !important' }}>
        <BrowserRouter>
          <TopNavbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginModal />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/userPanel" element={<UserPanel />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  )
}

export default App
