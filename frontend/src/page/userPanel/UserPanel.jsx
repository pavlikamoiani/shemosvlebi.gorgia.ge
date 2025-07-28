import React from 'react'
import UserTable from '../../components/UserTable'
import AddUserModal from '../../components/AddUserModal'
import { ThemeProvider, CssBaseline, Container, Paper, Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { createTheme } from '@mui/material/styles'
import defaultInstance from '../../../api/defaultInstance'

const theme = createTheme()


const UserPanel = () => {
  const [users, setUsers] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [userData, setUserData] = React.useState({
    id: null,
    name: '',
    email: '',
    branch_id: '',
    role: '',
    password: ''
  })
  const [branches, setBranches] = React.useState([])

  React.useEffect(() => {
    defaultInstance.get('/branches')
      .then(res => setBranches(res.data))
      .catch(() => setBranches([]))
  }, [])

  React.useEffect(() => {
    defaultInstance.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
  }, [])

  const handleOpenAdd = () => {
    setUserData({ id: null, name: '', email: '', branch_id: '', role: '', password: '' })
    setOpen(true)
  }

  const handleOpenEdit = (user) => {
    setUserData({
      id: user.id,
      name: user.name,
      email: user.email,
      branch_id: user.branch?.id || user.branch_id || '',
      role: user.role === 'admin' ? 'ადმინი' : (user.role === 'user' ? 'მომხმარებელი' : user.role),
      password: ''
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setUserData({ id: null, name: '', email: '', branch_id: '', role: '', password: '' })
  }

  const handleSubmit = async (formData) => {
    if (userData.id == null) {
      const newId = Math.max(0, ...users.map(u => u.id)) + 1

      const newUser = { ...userData, id: newId };
      console.log("New user added:", newUser);

      setUsers([...users, { ...userData, id: newId }])
    } else {
      try {
        const payload = {
          name: userData.name,
          email: userData.email,
          role: userData.role === 'ადმინი' ? 'admin' : 'user',
          branch_id: userData.branch_id,
        }
        if (userData.password) payload.password = userData.password

        const res = await defaultInstance.put(`/users/${userData.id}`, payload)
        setUsers(users.map(user =>
          user.id === userData.id
            ? { ...res.data, branch: branches.find(b => b.id === res.data.branch_id) }
            : user
        ))
        console.log("User edited:", res.data)
      } catch (error) {
        console.error("Error editing user:", error)
        alert("მომხმარებლის რედაქტირებისას დაფიქსირდა შეცდომა")
      }
    }
    handleClose()
  }

  const handleDeleteUser = async (userId) => {
    try {
      await defaultInstance.delete(`/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      console.log("Deleted user with ID:", userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("მომხმარებლის წაშლისას დაფიქსირდა შეცდომა");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                მომხმარებლების მართვა
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                მართეთ თქვენი სისტემის მომხმარებლები და მათი უფლებები
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                backgroundColor: "#017dbe",
              }}
              onClick={handleOpenAdd}
            >
              დაამატეთ მომხმარებელი
            </Button>
          </Box>

          <UserTable users={users} onDelete={handleDeleteUser} onEdit={(userId) => {
            const userToEdit = users.find(u => u.id === userId)
            if (userToEdit) handleOpenEdit(userToEdit)
          }} />
        </Paper>
      </Container>
      <AddUserModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        userData={userData}
        setUserData={setUserData}
        branches={branches}
      />
    </ThemeProvider>
  )
}

export default UserPanel