import React from 'react'

const AddBranchModal = ({ open, onClose, onSubmit, branchData, setBranchData }) => {
    if (!open) return null;

        const isEdit = branchData.id !== null;

        const handleChange = (e) => {
            const { name, value } = e.target
            setBranchData({
                ...branchData,
                [name]: value,
            })
        };
    

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{isEdit ? 'ფილიალის რედაქტირება' : 'დაამატეთ ახალი ფილიალი'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
          >
            <div className="form-group">
              <label>ფილიალის სახელი</label>
              <input
                type="text"
                name="name"
                value={branchData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>მისამართი</label>
              <input
                type="text"
                name="address"
                value={branchData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ტიპი:</label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="საწყობი"
                  checked={branchData.type === 'საწყობი'}
                  onChange={handleChange}
                />
                საწყობი
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="ჰიპერმარკეტი"
                  checked={branchData.type === 'ჰიპერმარკეტი'}
                  onChange={handleChange}
                />
                ჰიპერმარკეტი
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

export default AddBranchModal