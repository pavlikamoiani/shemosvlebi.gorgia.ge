import React, { useState, useEffect } from 'react'
// Remove custom CSS import
// import '../assets/css/EventModal.css'
import { useSelector } from 'react-redux'

const EventModal = ({
  open,
  selectedDate,
  onSave,
  onClose,
  branches = [],
  event = null,
  onDelete,
  isEdit = false,
  currentBranchId = null
}) => {
  const [supplier, setSupplier] = useState('');
  const [category, setCategory] = useState('');
  const [branch, setBranch] = useState('');
  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.role === 'admin';

  console.log('EventModal open:', selectedDate);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (isEdit && event) {
      setSupplier(event.extendedProps?.supplier || event.extendedProps?.name || '');
      setCategory(event.extendedProps?.category || '');
      setBranch(event.extendedProps?.branch_id || event.extendedProps?.branch || '');
    } else {
      setSupplier('');
      setCategory('');

      if (!isAdmin && user?.branch_id) {
        setBranch(String(user.branch_id));
      }
      else if (currentBranchId) {
        setBranch(String(currentBranchId));
      } else if (branches.length > 0) {
        setBranch(String(branches[0].id));
      } else {
        setBranch('');
      }
    }
  }, [isEdit, event, open, currentBranchId, branches, isAdmin, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (supplier.trim()) {
      // Pass full ISO string as event_date
      const event_date = selectedDate ? selectedDate.toISOString() : "";
      const eventData = {
        supplier: supplier,
        category,
        branch,
        event_date, // full date/time for backend
        // Remove old date/time fields
        // date: dateStr,
        // time: timeStr,
        // selectedDate,
      };
      try {
        if (onSave) onSave(eventData);
      } catch (err) {
        console.error("Event save error:", err);
      }
    }
  };

  const handleDelete = () => {
    if (onDelete && event) {
      onDelete(event);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return { dateStr: "", timeStr: "" }

    const georgianWeekDays = [
      "კვირა",
      "ორშაბათი",
      "სამშაბათი",
      "ოთხშაბათი",
      "ხუთშაბათი",
      "პარასკევი",
      "შაბათი"
    ];

    const georgianMonths = [
      "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
      "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
    ];

    const weekday = georgianWeekDays[date.getDay()];
    const day = date.getDate();
    const month = georgianMonths[date.getMonth()];
    const year = date.getFullYear();

    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    const dateStr = `${weekday}, ${day} ${month} ${year}`;
    const timeStr = `${hour}:${minute} სთ.`;

    return { dateStr, timeStr };
  }

  if (!open) return null;

  const { dateStr, timeStr } = selectedDate ? formatDateTime(selectedDate) : { dateStr: "", timeStr: "" }

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
        <h2 className="mb-4 text-center fw-bold">{isEdit ? "რედაქტირება" : "დაამატეთ ახალი ღონისძიება"}</h2>
        {selectedDate && (
          <div className="d-flex align-items-center gap-3 mb-3 justify-content-center" style={{ fontSize: "14px", opacity: "0.9" }}>
            <div className="d-flex align-items-center gap-1">
              <span>{dateStr}</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <span>{timeStr}</span>
            </div>
          </div>
        )}
        <form>
          <div className="form-group mb-3">
            <label className="form-label fw-semibold">მომწოდებელი</label>
            <input
              type="text"
              name="supplier"
              className="form-control"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label fw-semibold">კატეგორია</label>
            <input
              type="text"
              name="category"
              className="form-control"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label fw-semibold">ფილიალი</label>
            <select
              name="branch"
              className="form-select"
              value={branch}
              onChange={e => setBranch(e.target.value)}
              disabled={!isAdmin && user?.branch_id}
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button style={{ backgroundColor: "#017dbe", border: "none" }} type="submit" className="btn btn-primary px-4" onClick={handleSave}>
              {isEdit ? "შენახვა" : "დამატება"}
            </button>
            {isEdit && (
              <button type="button" className="btn btn-danger px-4" onClick={handleDelete}>
                წაშლა
              </button>
            )}
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>გაუქმება</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal;