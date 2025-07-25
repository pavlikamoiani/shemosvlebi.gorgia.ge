import React from 'react'
import '../assets/css/AddUserModal.css'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const AddUserModal = ({ open, onClose, onSubmit, userData, setUserData }) => {
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
    
  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{isEdit ? 'მომხმარებლის რედაქტირება' : 'დაამატეთ ახალი მომხმარებელი'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
          >
            <div className="form-group">
              <label>სახელი გვარი</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ელ.ფოსტა</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ბრენჩი</label>
              <input
                type="text"
                name="branch"
                value={userData.branch}
                onChange={handleChange}
              />
            </div>

            {!isEdit && (
              <div className="form-group" style={{ position: "relative" }}>
                <label>პაროლი</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "8px 36px 8px 8px", // extra right padding for icon
                      marginTop: 4,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                    }}
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

            <div className="form-group">
              <label>როლი:</label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="მომხმარებელი"
                  checked={userData.role === 'მომხმარებელი'}
                  onChange={handleChange}
                />
                მომხმარებელი
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="ადმინი"
                  checked={userData.role === 'ადმინი'}
                  onChange={handleChange}
                />
                ადმინი
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="submit">{isEdit ? 'შენახვა' : 'შენახვა'}</button>
              <button type="button" onClick={onClose} className="cancel-btn">გაუქმება</button>
            </div>
          </form>
        </div>
      </div>

      
    </>
  )
}



export default AddUserModal