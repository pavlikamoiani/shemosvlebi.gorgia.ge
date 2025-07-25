import React from 'react'
import BranchTable from '../../components/BranchTable'
import AddBranchModal from '../../components/AddBranchModal'
import { ThemeProvider, CssBaseline, Container, Paper, Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { createTheme } from '@mui/material/styles'
import defaultInstance from '../../../api/defaultInstance'


const theme = createTheme()


const Branch = () => {
  const [branches, setBranches] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [branchData, setBranchData] = React.useState({
    id: null,
    name: '',
    address: '',
    type: ''
  })

  React.useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await defaultInstance.get('/branches')
        const mappedBranches = response.data.map(branch => ({
          ...branch,
          type: branch.type === 'Hypermarket' ? 'ჰიპერმარკეტი'
            : branch.type === 'Warehouse' ? 'საწყობი'
              : branch.type
        }))
        setBranches(mappedBranches)
      } catch (error) {
        console.error("Error fetching branches:", error)
      }
    }
    fetchBranches()
  }, [])

  const handleOpenAdd = () => {
    setBranchData({ id: null, name: '', address: '', type: '' })
    setOpen(true)
  }

  const handleOpenEdit = (branch) => {
    setBranchData({ ...branch })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setBranchData({ id: null, name: '', address: '', type: '' })
  }

  const handleSubmit = async () => {
    if (branchData.id == null) {
      try {
        const response = await defaultInstance.post('/branches', branchData)
        const newBranch = response.data
        console.log("New branch added:", newBranch)
        setBranches([...branches, newBranch])
      } catch (error) {
        console.error("Error adding branch:", error)
      }
    } else {
      console.log("Branch edited:", branchData)
      setBranches(branches.map(branch => branch.id === branchData.id ? branchData : branch))
    }
    handleClose()
  }

  const handleDeleteBranch = (branchId) => {
    setBranches(branches.filter(branch => branch.id !== branchId))

    console.log("Deleted branch with ID:", branchId);
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
                ფილიალების მართვა
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                მართეთ თქვენი სისტემის ფილიალები
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
              დაამატეთ ფილიალი
            </Button>
          </Box>

          <BranchTable branches={branches} onDelete={handleDeleteBranch} onEdit={(branchId) => {
            const branchToEdit = branches.find(b => b.id === branchId);
            if (branchToEdit) {
              const branchToEdit = branches.find(b => b.id === branchId)
              if (branchToEdit) handleOpenEdit(branchToEdit)
            }
          }}
          />
        </Paper>
      </Container>


      <AddBranchModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        branchData={branchData}
        setBranchData={setBranchData}
      />
    </ThemeProvider>
  )
}

export default Branch