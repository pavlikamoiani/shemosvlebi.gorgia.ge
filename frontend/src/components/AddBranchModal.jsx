import React, { useState } from 'react'

const AddBranchModal = ({ open, onClose, onSubmit, branchData, setBranchData }) => {
  const [error, setError] = useState('');

  if (!open) return null;

  const isEdit = branchData.id !== null;

  const handleChange = (e) => {
    const { name, value } = e.target
    setBranchData({
      ...branchData,
      [name]: value,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit();
      // Remove onClose() from here - it's now called in the parent component
      // only on successful submission
    } catch (err) {
      // Try to extract error message from backend response
      let msg = 'დაფიქსირდა შეცდომა';
      if (err?.response?.data?.errors?.name) {
        // Laravel validation error for name
        if (
          err.response.data.errors.name.some(
            (m) =>
              m.includes('unique') ||
              m.includes('უკვე არსებობს') ||
              m.includes('already been taken')
          )
        ) {
          msg = 'ფილიალის სახელი არ უნდა იყოს დუბლირებული!';
        } else {
          msg = err.response.data.errors.name.join(' ');
        }
      }
      setError(msg);
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
        <h2 className="mb-4 text-center fw-bold">{isEdit ? 'ფილიალის რედაქტირება' : 'დაამატეთ ახალი ფილიალი'}</h2>
        <form
          onSubmit={handleSubmit}
        >
          <div className="form-group mb-3">
            <label className="form-label fw-semibold">ფილიალის სახელი</label>
            <input
              type="text"
              name="name"
              value={branchData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="მაგ: გორგია"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-semibold">მისამართი</label>
            <input
              type="text"
              name="address"
              value={branchData.address}
              onChange={handleChange}
              className="form-control"
              placeholder="მაგ: თბილისი, აღმაშენებლის 12"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-semibold mb-2">ტიპი:</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  type="radio"
                  name="type"
                  value="Warehouse"
                  checked={branchData.type === 'Warehouse'}
                  onChange={handleChange}
                  className="form-check-input"
                  id="type-warehouse"
                />
                <label className="form-check-label" htmlFor="type-warehouse">საწყობი</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="type"
                  value="Hypermarket"
                  checked={branchData.type === 'Hypermarket'}
                  onChange={handleChange}
                  className="form-check-input"
                  id="type-hypermarket"
                />
                <label className="form-check-label" htmlFor="type-hypermarket">ჰიპერმარკეტი</label>
              </div>
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-semibold">დროის ინტერვალი</label>
            <input
              type="number"
              name="interval"
              value={branchData.interval}
              onChange={handleChange}
              className="form-control"
              min={1}
              required
            />
          </div>

          <div className="d-flex flex-column gap-3 mb-4 shadow-sm p-3 rounded border ">
            <b>ფილიალის სამუშაო საათები.</b>
            <div className='d-flex flex-row gap-4'>
              <div className="form-group flex-fill">
                <label className="form-label fw-semibold">საწყისი დრო</label>
                <input
                  type="time"
                  name="startTime"
                  value={branchData.startTime}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group flex-fill">
                <label className="form-label fw-semibold">დასრულების დრო</label>
                <input
                  type="time"
                  name="endTime"
                  value={branchData.endTime}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>
          {error && (
            <div className="mt-4 mb-3 text-danger text-center p-2 border border-danger rounded bg-light" style={{ fontWeight: 500 }}>
              {error}
            </div>
          )}
          <div className="d-flex justify-content-end gap-2">
            <button style={{ background: '#017dbe', border: 'none' }} type="submit" className="btn btn-primary px-4">{isEdit ? 'შენახვა' : 'შენახვა'} </button>
            <button type="button" onClick={onClose} className="btn btn-outline-secondary px-4">გაუქმება</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddBranchModal