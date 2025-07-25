import { React } from 'react'
import { Provider } from 'react-redux'
import store from './store/store'
import Dashboard from './page/dashboard/Dashboard'
import {Router, Route, Routes, RouterProvider, BrowserRouter, Outlet} from 'react-router-dom'
import NavRoutes from './components/NavRoutes'
import UserPanel from './page/userPanel/UserPanel'
import Branches from './page/branch/Branch'

function App() {
// test
  return (
    <Provider store={store}>
      <div style={{ margin: '0 !important'}}>
        <BrowserRouter>
          <NavRoutes />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/userPanel" element={<UserPanel />} />
          </Routes>

        </BrowserRouter>
      </div>
    </Provider>
  )
}

export default App
