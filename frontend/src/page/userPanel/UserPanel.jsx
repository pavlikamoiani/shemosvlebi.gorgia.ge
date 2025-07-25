import React from 'react'
import UserTable from '../../components/UserTable'
import AddUserModal from '../../components/AddUserModal'
import { ThemeProvider, CssBaseline, Container, Paper, Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()


const UserPanel = () => {
  const exampleUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', branch: 'Development', role: 'ადმინი' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', branch: 'Marketing', role: 'მომხმარებელი' },
    // add more users if needed
  ]

  const [users, setUsers] = React.useState(exampleUsers)
  const [open, setOpen] = React.useState(false)
  const [userData, setUserData] = React.useState({
    id: null,
    name: '',
    email: '',
    branch: '',
    role: ''
  })

  const handleOpenAdd = () => {
    setUserData({ id: null, name: '', email: '', branch: '', role: '' })
    setOpen(true)
  }

  const handleOpenEdit = (user) => {
    setUserData({ ...user })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setUserData({ id: null, name: '', email: '', branch: '', role: '' })
  }

  const handleSubmit = () => {
    if (userData.id == null) {
      const newId = Math.max(0, ...users.map(u => u.id)) + 1

      const newUser = { ...userData, id: newId }; //needed only for console log
      console.log("New user added:", newUser);

      setUsers([...users, { ...userData, id: newId }])
    } else {
      console.log("User edited:", userData); 

      setUsers(users.map(user => user.id === userData.id ? userData : user))
    }
    handleClose()
  }

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId))
    console.log("Deleted user with ID:", userId);
  }

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
            const userToEdit = users.find(u => u.id === userId);
            if (userToEdit) {
              const userToEdit = users.find(u => u.id === userId)
            if (userToEdit) handleOpenEdit(userToEdit)
            }
          }} 
          />
        </Paper>
      </Container>
      <AddUserModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        userData={userData}
        setUserData={setUserData}
      />
    </ThemeProvider>
  )
}

export default UserPanel