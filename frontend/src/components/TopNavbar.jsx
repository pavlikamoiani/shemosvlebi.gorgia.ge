import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedLocation } from '../store/slices/filtersSlice'
import { selectSelectedLocation } from '../store/selectors'
import LoginModal from './LoginModal'
import logo from '../assets/logo.png'
import MenuModal from './MenuModal'
import { login, setAuthFromStorage } from '../store/slices/authSlice'
import defaultInstance from '../../api/defaultInstance'
import '../assets/css/TopNavbar.css' // импортируем CSS

const TopNavbar = () => {
  const dispatch = useDispatch()
  const selectedLocation = useSelector(selectSelectedLocation)
  const accessToken = useSelector(state => state.auth.accessToken)

  const [branches, setBranches] = useState([])
  const [registerOpen, setRegisterOpen] = useState(false)
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [menuActive, setMenuActive] = useState(false)

  useEffect(() => {
    defaultInstance.get('/branches')
      .then(res => setBranches(res.data))
      .catch(() => setBranches([]))
  }, [])

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    const token = localStorage.getItem('authToken')
    let userData = null;

    try {
      userData = JSON.parse(localStorage.getItem('userData'));
    } catch (e) {
      console.error('Failed to parse user data from localStorage');
    }

    dispatch(setAuthFromStorage({ email, token, user: userData }))
  }, [dispatch])

  const handleLocationSelect = (branchName, branchId) => {
    dispatch(setSelectedLocation(branchName))
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('userEmail', registerEmail)
    dispatch(login(registerEmail))

    setRegisterOpen(false)
    setRegisterEmail("")
    setRegisterPassword("")
  }

  const handleLoginSuccess = () => {
    setMenuActive(true)
    setRegisterOpen(false)
    setRegisterEmail("")
    setRegisterPassword("")
  }

  return (
    <div
      className="shadow-md p-4 rounded-lg text-gray-700 bg-light topnavbar-root"
    >
      <div
        className="topnavbar-logo"
        onClick={() => window.location.reload()}
      >
        <img src={logo} alt="Logo" className="topnavbar-logo-img" />
      </div>
      <div className="d-flex flex-row flex-nowrap align-items-center topnavbar-branches">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => handleLocationSelect(branch.name, branch.id)}
            className={`btn topnavbar-branch-btn ${selectedLocation === branch.name ? "active" : ""}`}
          >
            {branch.name}
          </button>
        ))}
      </div>
      <div style={{ width: '10%' }}>
        {!accessToken ? (
          <button
            onClick={() => setRegisterOpen(true)}
            className="btn btn-primary"
            style={{
              borderRadius: "8px",
              fontWeight: "bold",
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: "#017dbe",
              border: "none",
            }}
          >
            ავტორიზაცია
          </button>
        ) : (
          <MenuModal />
        )}
      </div>

      <LoginModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        email={registerEmail}
        setEmail={setRegisterEmail}
        password={registerPassword}
        setPassword={setRegisterPassword}
      />
    </div>
  )
}

export default TopNavbar