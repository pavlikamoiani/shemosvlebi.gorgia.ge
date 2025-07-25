import { React, useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { selectFilteredEvents, selectSelectedLocation } from '../../store/selectors'
import { addEvent, deleteEvent, updateEvent } from '../../store/slices/eventsSlice'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import EventModal from "../../components/EventModal"
import kaLocale from '@fullcalendar/core/locales/ka'
import "../../assets/css/Dashboard.css"
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import defaultInstance from "../../../api/defaultInstance"
const Dashboard = () => {
  // Redux state
  const dispatch = useDispatch()
  const filteredEvents = useSelector(selectFilteredEvents)
  const selectedLocation = useSelector(selectSelectedLocation)
  const user = useSelector(state => state.auth.isLoggedIn)
  const branchEvents = useSelector(state => state.events.branchEvents)

  // Local state
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [branches, setBranches] = useState([]) // new state for branches
  const [calendarEvents, setCalendarEvents] = useState([]) // backend events

  useEffect(() => {
    // Fetch branches on mount
    defaultInstance.get('/branches')
      .then(res => setBranches(res.data))
      .catch(() => setBranches([]))
  }, [])

  useEffect(() => {
    // Fetch events from backend for calendar
    defaultInstance.get('/events')
      .then(res => setCalendarEvents(
        res.data.map(ev => {
          const startDate = new Date(ev.event_date);
          const endDate = new Date(startDate.getTime() + 15 * 60000); // add 15 minutes
          return {
            id: ev.id,
            name: ev.supplier || ev.user?.name || '-',
            category: ev.category,
            branch: ev.branch?.name || '-',
            start: startDate.toISOString(), // ensure ISO format for FullCalendar
            end: endDate.toISOString(),     // ensure ISO format for FullCalendar
            backgroundColor: "#3788d8",
            borderColor: "#3788d8",
            ...ev
          }
        })
      ))
      .catch(() => setCalendarEvents([]))
  }, [])

  const handleDateClick = (arg) => {
    if (!user) {
      alert("Please log in to create an event.");
      arg.view.calendar.unselect(); // clearing selection
      tippy.hideAll(); // hide all tooltips
      return;
    } else {
      setSelectedEvent(arg.date)
      setModalOpened(true)
    }
  }

  // Helper to format JS Date exactly as 'YYYY-MM-DDTHH:mm:ss' without milliseconds or timezone
  function formatLocalDateTime(date) {
    // Ensure date is a JS Date object
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const pad = n => n.toString().padStart(2, '0');

    // Format exactly matching backend requirement: Y-m-d\TH:i:s
    return (
      date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds())
    );
  }

  // uses Redux
  const handleSaveEvent = async (eventData) => {
    try {
      const formattedDate = formatLocalDateTime(selectedEvent);
      console.log("Original date:", selectedEvent);
      console.log("Formatted date to send:", formattedDate);

      const payload = {
        ...eventData,
        event_date: formattedDate,
      };

      console.log("Payload being sent:", payload);

      const response = await defaultInstance.post('/events', payload);
      console.log("Backend response:", response.data);

      setModalOpened(false);

      defaultInstance.get('/events')
        .then(res => setCalendarEvents(
          res.data.map(ev => {
            const startDate = new Date(ev.event_date);
            const endDate = new Date(startDate.getTime() + 15 * 60000); // add 15 minutes
            return {
              id: ev.id,
              name: ev.supplier || ev.user?.name || '-',
              category: ev.category,
              branch: ev.branch?.name || '-',
              start: startDate.toISOString(), // ensure ISO format for FullCalendar
              end: endDate.toISOString(),     // ensure ISO format for FullCalendar
              backgroundColor: "#3788d8",
              borderColor: "#3788d8",
              ...ev
            }
          })
        ));
    } catch (e) {
      console.error('Event creation failed:', e.response?.data || e);
      alert('Event creation failed: ' + (e.response?.data?.message || e.message));
    }
  };

  // Helper to delete event via API
  const handleDeleteEvent = async (event) => {
    try {
      await defaultInstance.delete(`/events/${event.id}`);
      // Refresh events after deletion
      defaultInstance.get('/events')
        .then(res => setCalendarEvents(
          res.data.map(ev => {
            const startDate = new Date(ev.event_date);
            const endDate = new Date(startDate.getTime() + 15 * 60000);
            return {
              id: ev.id,
              name: ev.supplier || ev.user?.name || '-',
              category: ev.category,
              branch: ev.branch?.name || '-',
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              backgroundColor: "#3788d8",
              borderColor: "#3788d8",
              ...ev
            }
          })
        ));
    } catch (e) {
      console.error('Event deletion failed:', e.response?.data || e);
      alert('Event deletion failed: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event)
    if (window.confirm(`Delete event '${clickInfo.event.extendedProps.name}'?`)) {
      handleDeleteEvent(clickInfo.event); // use API delete
      setSelectedEvent(null)
    }
  }

  const handleEventDrop = (dropInfo) => {
    const updatedData = {
      start: dropInfo.event.start,
      end: dropInfo.event.end,
    }
    dispatch(updateEvent({ id: dropInfo.event.id, updates: updatedData }))
  }

  const georgianDays = {
    0: "კვი",
    1: "ორშ",
    2: "სამ",
    3: "ოთხ",
    4: "ხუთ",
    5: "პარ",
    6: "შაბ",
  };

  const georgianMonths = [
    "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
    "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* Inset box-shadow for aria-pressed="true" buttons */}
      <style>
        {`
          button[aria-pressed="true"] {
            box-shadow: inset 0 2px 8px rgba(1, 125, 190, 0.25), 0 0px 0px transparent !important;
          }

          .fc-button-active {
            box-shadow: inset 0 2px 8px rgba(1, 125, 190, 0.25), 0 0px 0px transparent !important;
          }
        `}
      </style>
      {/* Main Dashboard */}
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >

        {/* Event Modal */}
        {modalOpened && (
          <EventModal
            open={modalOpened}
            selectedDate={selectedEvent}
            onSave={handleSaveEvent}
            onClose={() => {
              setModalOpened(false);
              setSelectedEvent(null);
            }}
            branches={branches} // pass branches here
          />
        )}

        {/* Calendar */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginTop: "80px",
          }}
        >
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView="timeGridWeek"
            locales={[kaLocale]}
            locale="ka"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            buttonText={{
              today: "დღეს",
              month: "თვე",
              week: "კვირა",
              day: "დღე",
              list: "სია",
            }}
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            editable={true}
            droppable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            height="auto"
            eventDisplay="block"
            eventContent={arg => {
              const name = arg.event.extendedProps.name;
              const category = arg.event.extendedProps.category;
              return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ color: "	#BEBEBE" }}>{arg.timeText}</span>
                  <span style={{ fontWeight: 500 }}>{name}</span>
                  <span>{category}</span>
                </div>
              );
            }}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
              meridiem: "short",
            }}
            slotDuration="00:15:00"
            slotLabelInterval="00:15:00"
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
              meridiem: "short",
            }}
            slotMinTime="09:00:00"
            slotMaxTime="21:15:00"
            eventClassNames="custom-event"
            dayCellClassNames="custom-day-cell"

            dayHeaderContent={(arg) => {
              const viewType = arg.view.type;
              const date = arg.date;

              const weekday = georgianDays[date.getDay()];
              const day = date.getDate();
              const month = date.getMonth() + 1;

              if (viewType === "timeGridWeek" || viewType === "timeGridDay") {
                return (
                  <div style={{ display: "flex", flexDirection: "row", gap: "4px", alignItems: "center", justifyContent: "between" }}>
                    <span>{weekday}</span>
                    <span style={{ fontSize: "0.9em", fontWeight: "bold", color: "#017dbe" }}>
                      {`${day}/${month}`}
                    </span>
                  </div>
                );
              }

              return weekday;
            }}
            titleFormat={arg => {
              const month = georgianMonths[arg.date.month];
              const year = arg.date.year;
              return `${month} ${year}`;
            }}

            //tooltip for events
            eventDidMount={(info) => {
              // Only show tooltip for events that have an id (i.e., saved events)
              if (info.event.id) {
                tippy(info.el, {
                  content: `
                    <strong>მომწოდებელი:</strong> ${info.event.extendedProps.name}<br/>
                    <strong>კატეგორია:</strong> ${info.event.extendedProps.category}<br/>
                  `,
                  allowHTML: true,
                  placement: 'top',
                  theme: 'light-border',
                  arrow: true,
                });
              }
            }}
          />
        </div>
        <div className="mt-4">
          <h4>ფილიალის ღონისძიებები</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>დასახელება</th>
                <th>კატეგორია</th>
                <th>ფილიალი</th>
                <th>დაწყება</th>
                <th>დასრულება</th>
              </tr>
            </thead>
            <tbody>
              {branchEvents && branchEvents.length > 0 ? (
                branchEvents.map(ev => (
                  <tr key={ev.id}>
                    <td>{ev.supplier || ev.user?.name || '-'}</td>
                    <td>{ev.category}</td>
                    <td>{ev.branch?.name || '-'}</td>
                    <td>{ev.event_date}</td>
                    <td>{ev.event_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">ღონისძიებები არ მოიძებნა</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  )
}

export default Dashboard;