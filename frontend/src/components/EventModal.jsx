import React, { useState, useEffect } from 'react'
// Remove custom CSS import
// import '../assets/css/EventModal.css'
import defaultInstance from '../../api/defaultInstance'

const EventModal = ({ open, selectedDate, onSave, onClose, branches = [] }) => {
  const [supplier, setSupplier] = useState('');
  const [category, setCategory] = useState('');
  const [branch, setBranch] = useState('');


  console.log('EventModal open:', selectedDate);

  // Prevent background scrolling when modal is open
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
        const response = await defaultInstance.post('/events', eventData);
        console.log("Saved Event:", response.data);
        if (onSave) onSave(response.data); // Pass backend response to parent
        setSupplier('');
        setCategory('');
        setBranch('');
      } catch (err) {
        console.error("Event save error:", err);
      }
    }
  };

  // formatting date and time in georgian
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

    // Format time as HH:MM (24-hour)
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0"); //ეს ხდის 9-ს 09-დ

    const dateStr = `${weekday}, ${day} ${month} ${year}`;
    const timeStr = `${hour}:${minute} სთ.`;

    return { dateStr, timeStr };
  }

  if (!open) return null;

  const { dateStr, timeStr } = selectedDate ? formatDateTime(selectedDate) : { dateStr: "", timeStr: "" }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">დაამატეთ ახალი ღონისძიება</h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {selectedDate && (
              <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: "14px", opacity: "0.9" }}>
                <div className="d-flex align-items-center gap-1">
                  <span>{dateStr}</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span>{timeStr}</span>
                </div>
              </div>
            )}
            <form>
              <div className="mb-3">
                <label className="form-label">მომწოდებელი</label>
                <input
                  type="text"
                  name="supplier"
                  className="form-control"
                  value={supplier}
                  onChange={e => setSupplier(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">კატეგორია</label>
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">ფილიალი</label>
                <select
                  name="branch"
                  className="form-control"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                >
                  <option value="">აირჩიეთ ფილიალი</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary" onClick={handleSave}>შენახვა</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>გაუქმება</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventModal;