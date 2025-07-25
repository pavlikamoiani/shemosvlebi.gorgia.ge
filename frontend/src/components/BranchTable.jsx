import React, { StrictMode } from 'react';
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
  alpha,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PinDrop as PinDropIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"



// Styled components for better visual appeal
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
}))

const StyledTableHead = styled(TableHead)(() => ({
  background: `linear-gradient(135deg, #1976d2 0%, #115293 100%)`,
  "& .MuiTableCell-head": {
    color: "white",
    fontWeight: 600,
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
}))

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha("#1976d2", 0.02),
  },
  "&:hover": {
    backgroundColor: alpha("#1976d2", 0.08),
    transform: "translateY(-1px)",
    transition: "all 0.2s ease-in-out",
  },
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha("#000", 0.1)}`,
    padding: "16px",
  },
}))


export default function UserTable({ branches, onDelete, onEdit }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState(null)


  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (branchToDelete) {
      onDelete(branchToDelete.id)
      setDeleteDialogOpen(false)
      setBranchToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setBranchToDelete(null)
  }

  return (
    <>
      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow style={{ backgroundColor: "#005c8b" }}>
              <TableCell>ფილიალი</TableCell>
              <TableCell>მისამართი</TableCell>
              <TableCell>ტიპი</TableCell>
              <TableCell align="center">მოქმედებები</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {branches.map((branch) => (
              <StyledTableRow key={branch.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {branch.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {branch.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PinDropIcon fontSize="small" color="action" />
                    <Typography variant="body2">{branch.address}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {branch.type}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="რედაქტირება">
                    <IconButton color="primary" onClick={() => onEdit(branch.id)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="წაშლა">
                    <IconButton color="error" onClick={() => handleDeleteClick(branch)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteIcon color="error" />
            დარწმუნებული ხართ?
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ეს მოქმედება შეუქცევადია. ეს სამუდამოდ წაშლის ფილიალს <strong>{branchToDelete?.name}</strong>-ს.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>გაუქმება</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            წაშლა
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}