import React from 'react'
import '../assets/css/AddUserModal.css'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import defaultInstance from '../../api/defaultInstance'

const AddUserModal = ({ open, onClose, onSubmit, userData, setUserData, branches }) => {
  const [showPassword, setShowPassword] = React.useState(false)

  if (!open) return null;

  const isEdit = userData.id !== null;

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await defaultInstance.post('/users', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role === 'ადმინი' ? 'admin' : 'user',
        branch_id: userData.branch_id || null,
      });
      onSubmit(response.data);
    } catch (error) {
      // handle error (optional)
    }
  };

  return (
    <div
      className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="modal-content bg-white rounded shadow-lg p-4"
        style={{
          minWidth: 400,
          maxWidth: 500,
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.15), 0 4px 32px rgba(0,0,0,0.2)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="mb-4 text-center fw-bold">{isEdit ? 'მომხმარებლის რედაქტირება' : 'დაამატეთ ახალი მომხმარებელი'}</h2>
        <form onSubmit={isEdit ? onSubmit : handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label fw-semibold">სახელი გვარი</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="form-control border-primary"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-semibold">ელ.ფოსტა</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="form-control border-primary"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-semibold">ბრენჩი</label>
            <select
              name="branch_id"
              value={userData.branch_id || ''}
              onChange={handleChange}
              className="form-select border-primary"
              required
            >
              <option value="" disabled>აირჩიეთ ბრენჩი</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {!isEdit && (
            <div className="form-group mb-3" style={{ position: "relative" }}>
              <label className="form-label fw-semibold">პაროლი</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="form-control border-primary"
                  style={{
                    paddingRight: 36,
                    marginTop: 4,
                  }}
                  required
                />
                <span
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    height: "24px",
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </div>
          )}

          <div className="form-group mb-3">
            <label className="form-label fw-semibold mb-2">როლი:</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  type="radio"
                  name="role"
                  value="მომხმარებელი"
                  checked={userData.role === 'მომხმარებელი'}
                  onChange={handleChange}
                  className="form-check-input"
                  id="role-user"
                />
                <label className="form-check-label" htmlFor="role-user">მომხმარებელი</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="role"
                  value="ადმინი"
                  checked={userData.role === 'ადმინი'}
                  onChange={handleChange}
                  className="form-check-input"
                  id="role-admin"
                />
                <label className="form-check-label" htmlFor="role-admin">ადმინი</label>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="submit" className="btn btn-primary px-4">{isEdit ? 'შენახვა' : 'შენახვა'}</button>
            <button type="button" onClick={onClose} className="btn btn-outline-secondary px-4">გაუქმება</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal