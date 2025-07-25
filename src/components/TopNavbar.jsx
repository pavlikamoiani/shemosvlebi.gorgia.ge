import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedLocation } from '../store/slices/filtersSlice'
import { selectSelectedLocation, selectLocations } from '../store/selectors'
import LoginModal from './LoginModal'
import logo from '../assets/logo.png'
import MenuModal from './MenuModal'
import { login, setAuthFromStorage } from '../store/slices/authSlice'

const TopNavbar = () => {
  // Redux state
  const dispatch = useDispatch()
  const selectedLocation = useSelector(selectSelectedLocation)
  const locations = useSelector(selectLocations)
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  
  // Local state for registration
  const [registerOpen, setRegisterOpen] = useState(false)
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    dispatch(setAuthFromStorage(email))
  }, [dispatch])


  // Handler for location selection
  const handleLocationSelect = (location) => {
    dispatch(setSelectedLocation(location))
  }


  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    //saving to local storage
    localStorage.setItem('userEmail', registerEmail)
    dispatch(login(registerEmail))

    setRegisterOpen(false)
    setRegisterEmail("")
    setRegisterPassword("")
  }

  return (
      <div
        style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: 'center',
            alignItems: "center",
            gap: "4px",
            flexWrap: "wrap",
            backgroundColor: "#edf2f7",
            padding: "10px 20px",
            position: 'relative',
          }}
          className='shadow-md p-4 rounded-lg text-gray-700'
        >
            <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '5px' }}>
                <img src={logo} alt="Logo" style={{ height: '40px', width: 'auto', translateY: '-50%' }} />
            </div>
            <div style={{width: '10%'}}></div>
        {locations.map((location) => (
        <button
            key={location}
            onClick={() => handleLocationSelect(location)}
            style={{
            padding: "10px 20px",
            backgroundColor: "transparent",
            color:
                selectedLocation === location ? "#017dbe" : "#2d3748",
            border:
                selectedLocation === location
                ? "2px solid #017dbe"
                : "2px solid transparent",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "color 0.2s, border 0.2s",
            }}
        >
            {location}
        </button>
        ))}
        <div style={{width: '10%'}}>
            {!isLoggedIn ? (
              <button
                onClick={() => setRegisterOpen(true)}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#017dbe",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
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
            onSubmit={handleRegisterSubmit}
            email={registerEmail}
            setEmail={setRegisterEmail}
            password={registerPassword}
            setPassword={setRegisterPassword}
        />
    </div>
  )
}

export default TopNavbar