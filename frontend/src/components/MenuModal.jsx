import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'


const MenuModal = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleMenuItemClick = (path) => {
    navigate(path)
    handleMenuClose()
  }
  
  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    dispatch(logout())
    navigate("/")
  }

  return (
    <div>
      <button
        onClick={handleMenuClick}
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MenuIcon style={{ color: 'white' }} />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('/')}>მთავარი</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/userPanel')}>მომხმარებლები</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/branches')}>ფილიალები</MenuItem>
        <MenuItem onClick={handleLogout}>გასვლა</MenuItem>
      </Menu>
    </div>
  )
}

export default MenuModal