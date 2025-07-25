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
  Email as EmailIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
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

const roleLabels = {
  'ადმინი': 'ადმინი',
  'მომხმარებელი': 'მომხმარებელი',
  'admin': 'ადმინი',
  'user': 'მომხმარებელი'
};

export default function UserTable({ users, onDelete, onEdit }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getAvatarColor = (name) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      onDelete(userToDelete.id)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  return (
    <>
      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow style={{ backgroundColor: "#005c8b" }}>
              <TableCell>მომხმარებელი</TableCell>
              <TableCell>ელ.ფოსტა</TableCell>
              <TableCell>ბრენჩი</TableCell>
              <TableCell>როლი</TableCell>
              <TableCell align="center">მოქმედებები</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: getAvatarColor(user.name),
                        width: 40,
                        height: 40,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2">{user.branch}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {roleLabels[user.role] || user.role}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="რედაქტირება">
                    <IconButton color="primary" onClick={() => onEdit(user.id)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="წაშლა">
                    <IconButton color="error" onClick={() => handleDeleteClick(user)} size="small">
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
            ეს მოქმედება შეუქცევადია. ეს სამუდამოდ წაშლის მომხმარებელს <strong>{userToDelete?.name}</strong>-ს.
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