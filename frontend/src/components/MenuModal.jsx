import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import defaultInstance from '../../api/defaultInstance'
import { useSelector } from 'react-redux'

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
    defaultInstance.post('/logout')
    dispatch(logout())
    navigate("/")
  }

  const userRole = useSelector((state) => state.auth.user?.role)

  return (
    <div>
      <button
        onClick={handleMenuClick}
        style={{
          padding: "10px 15px",
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
        {userRole && userRole !== 'user' && (
          <>
            <MenuItem onClick={() => handleMenuItemClick('/')}>მთავარი</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/userPanel')}>მომხმარებლები</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/branches')}>ფილიალები</MenuItem>
          </>
        )}
        <MenuItem
          onClick={handleLogout}
          style={{
            color: '#d32f2f',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
          }}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
            }
          }}
        >
          <LogoutIcon fontSize="small" />
          გასვლა
        </MenuItem>
      </Menu>
    </div>
  )
}

export default MenuModal