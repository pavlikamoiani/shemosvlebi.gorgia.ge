import React, { useState, useEffect } from 'react'
import '../assets/css/EventModal.css'

const EventModal = ({  open, selectedDate, onSave, onClose  }) => {
    const [name, setName] = useState('');
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

    const handleSave = (e) => {
        e.preventDefault();
        if (name.trim()) {
          const { dateStr, timeStr } = selectedDate ? formatDateTime(selectedDate) : { dateStr: "", timeStr: "" };
          console.log("Saved Event:", {
                მომწოდებელი: name,
                კატეგორია: category,
                ფილიალი: branch,
                თარიღი: dateStr,
                დრო: timeStr
            });
            onSave({ name, category, branch, selectedDate });
            setName('');
            setCategory('');
            setBranch('');
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
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>დაამატეთ ახალი ღონისძიება</h2>
                {/* Move date/time display here, right below header */}
                {selectedDate && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      fontSize: "14px",
                      opacity: "0.9",
                      marginBottom: "16px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{dateStr}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{timeStr}</span>
                    </div>
                  </div>
                )}
                <form>
                    <div className="form-group">
                    <label>მომწოდებელი</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    </div>

                    <div className="form-group">
                    <label>კატეგორია</label>
                    <input
                        type="text"
                        name="category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />
                    </div>

                    <div className="form-group">
                        <label>ფილიალი</label>
                        <input
                            type="text"
                            name="branch"
                            value={branch}
                            onChange={e => setBranch(e.target.value)}
                        />
                    </div>
                </form>
                 <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button type="submit" onClick={handleSave}>შენახვა</button>
                    <button type="button" onClick={onClose} className="cancel-btn">გაუქმება</button>
                </div>
            </div>
        </div>
    )
}

export default EventModal;