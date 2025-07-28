import { React, useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedLocation } from '../../store/selectors'
import { updateEvent } from '../../store/slices/eventsSlice'
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const dispatch = useDispatch()
  const selectedLocation = useSelector(selectSelectedLocation)
  const user = useSelector(state => state.auth.user)

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [branches, setBranches] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [eventToEdit, setEventToEdit] = useState(null)

  useEffect(() => {
    defaultInstance.get('/branches')
      .then(res => setBranches(res.data))
      .catch(() => setBranches([]))
  }, [])

  useEffect(() => {
    const branchObj = branches.find(b => b.name === selectedLocation)
    const branchId = branchObj?.id

    if (branchId) {
      defaultInstance.get(`/events?branch_id=${branchId}`)
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
        ))
        .catch(() => setCalendarEvents([]))
    } else {
      defaultInstance.get('/events?branch_id=1')
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
        ))
        .catch(() => setCalendarEvents([]))
    }
  }, [selectedLocation, branches])

  const handleDateClick = (arg) => {
    if (!user) {
      alert("Please log in to create an event.");
      arg.view.calendar.unselect();
      tippy.hideAll();
      return;
    }

    const isAdmin = user?.role === 'admin';
    const userBranch = branches.find(b => b.id === user?.branch_id)?.name;

    if (!isAdmin && userBranch && selectedLocation !== userBranch) {
      toast.error(`თქვენ შეგიძლიათ დაამატოთ ღონისძიება მხოლოდ "${userBranch}" ფილიალში`);
      return;
    }

    setSelectedEvent(arg.date)
    setModalOpened(true)
  }

  function formatLocalDateTime(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const pad = n => n.toString().padStart(2, '0');

    return (
      date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds())
    );
  }

  const refreshEvents = () => {
    const branchObj = branches.find(b => b.name === selectedLocation);
    const branchId = branchObj?.id;

    if (branchId) {
      defaultInstance.get(`/events?branch_id=${branchId}`)
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
        ))
        .catch(() => setCalendarEvents([]));
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const formattedDate = formatLocalDateTime(selectedEvent);

      if (user && user.role !== 'admin' && user.branch_id) {
        eventData.branch = user.branch_id;
      }

      const payload = {
        ...eventData,
        event_date: formattedDate,
      };

      console.log("Payload being sent:", payload);

      const response = await defaultInstance.post('/events', payload);
      console.log("Backend response:", response.data);

      setModalOpened(false);

      refreshEvents();
    } catch (e) {
      toast.error(e.response?.data?.message);
    }

  };

  console.log("Branches loaded:", branches);

  const handleUpdateEvent = async (eventData) => {
    if (!eventToEdit) return;
    try {
      const eventUserId = eventToEdit.extendedProps.user_id;
      const currentUserId = user?.id;
      const isAdmin = user?.role === 'admin';

      if (!isAdmin && eventUserId !== currentUserId) {
        toast.error("თქვენ არ გაქვთ ამ ღონისძიების რედაქტირების უფლება");
        setEditModalOpened(false);
        setEventToEdit(null);
        return;
      }

      const payload = {
        ...eventData,
        event_date: eventToEdit.start.toISOString(),
      };
      await defaultInstance.put(`/events/${eventToEdit.id}`, payload);
      setEditModalOpened(false);
      setEventToEdit(null);

      refreshEvents();
    } catch (e) {
      toast.error('Event update failed: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      const eventUserId = event.extendedProps.user_id;
      const currentUserId = user?.id;
      const isAdmin = user?.role === 'admin';

      if (!isAdmin && eventUserId !== currentUserId) {
        toast.error("თქვენ არ გაქვთ ამ ღონისძიების წაშლის უფლება");
        return;
      }

      await defaultInstance.delete(`/events/${event.id}`);

      refreshEvents();
    } catch (e) {
      console.error('Event deletion failed:', e.response?.data || e);
      toast.error('Event deletion failed: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleDeleteEventFromModal = async () => {
    if (!eventToEdit) return;
    try {
      const eventUserId = eventToEdit.extendedProps.user_id;
      const currentUserId = user?.id;
      const isAdmin = user?.role === 'admin';

      if (!isAdmin && eventUserId !== currentUserId) {
        toast.error("თქვენ არ გაქვთ ამ ღონისძიების წაშლის უფლება");
        setEditModalOpened(false);
        setEventToEdit(null);
        return;
      }

      await defaultInstance.delete(`/events/${eventToEdit.id}`);
      setEditModalOpened(false);
      setEventToEdit(null);

      refreshEvents();
    } catch (e) {
      toast.error('Event deletion failed: ' + (e.response?.data?.message || e.message));
    }
  }

  const handleEventClick = (clickInfo) => {
    const eventUserId = clickInfo.event.extendedProps.user_id;
    const currentUserId = user?.id;
    const isAdmin = user?.role === 'admin';

    if (isAdmin || eventUserId === currentUserId) {
      setEventToEdit(clickInfo.event);
      setEditModalOpened(true);
    } else {
      toast.error("თქვენ არ გაქვთ ამ ღონისძიების რედაქტირების უფლება");
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

  const currentBranch = branches.find(b => b.name === selectedLocation)

  return (
    <div style={{ position: "relative" }}>
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
            branches={branches}
            currentBranchId={currentBranch ? currentBranch.id : null}
          />
        )}
        {editModalOpened && eventToEdit && (
          <EventModal
            open={editModalOpened}
            selectedDate={eventToEdit.start}
            event={eventToEdit}
            onSave={handleUpdateEvent}
            onDelete={handleDeleteEventFromModal}
            onClose={() => {
              setEditModalOpened(false);
              setEventToEdit(null);
            }}
            branches={branches}
            currentBranchId={currentBranch ? currentBranch.id : null}
            isEdit={true}
          />
        )}

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

            eventDidMount={(info) => {
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
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>

  )
}

export default Dashboard;