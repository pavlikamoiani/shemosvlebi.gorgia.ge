import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedLocation } from '../store/slices/filtersSlice'
import { selectSelectedLocation } from '../store/selectors'
import LoginModal from './LoginModal'
import logo from '../assets/logo.png'
import MenuModal from './MenuModal'
import { login, setAuthFromStorage } from '../store/slices/authSlice'
import defaultInstance from '../../api/defaultInstance'

const TopNavbar = () => {
  // Redux state
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
      className="shadow-md p-4 rounded-lg text-gray-700 bg-light"
      style={{
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
        gap: "4px",
        flexWrap: "nowrap",
        backgroundColor: "#edf2f7",
        padding: "10px 20px",
        position: 'relative',
        overflowX: "auto",
      }}
    >
      <div
        style={{ position: 'absolute', top: '20px', left: '20px', padding: '5px', cursor: 'pointer' }}
        onClick={() => window.location.reload()}
      >
        <img src={logo} alt="Logo" style={{ height: '40px', width: 'auto', translateY: '-50%' }} />
      </div>
      <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></div>
      <div className="d-flex flex-row flex-nowrap align-items-center" style={{ gap: "8px", flex: 1, overflowX: "auto" }}>
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => handleLocationSelect(branch.name, branch.id)}
            className={`btn btn-outline-primary ${selectedLocation === branch.name ? "active" : ""}`}
            style={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              borderRadius: "20px",
              borderWidth: selectedLocation === branch.name ? "2px" : "1px",
              borderColor: selectedLocation === branch.name ? "#017dbe" : "#ced4da",
              color: selectedLocation === branch.name ? "#017dbe" : "#2d3748",
              backgroundColor: "transparent",
              transition: "color 0.2s, border 0.2s",
              marginRight: "8px",
              margin: "5px 0",
            }}
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