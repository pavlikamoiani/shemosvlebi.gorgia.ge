import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  events: [
    {
      id: "1",
      name: "გიორგი",
      category: "შეხვედრა",
      branch: "დიდუბე",
      start: "2025-07-24T10:00:00",
      end: "2025-07-24T10:15:00",
      backgroundColor: "#3788d8",
      borderColor: "#3788d8",
    },
    {
      id: "2",
      name: "თამარი",
      category: "დედლაინი",
      branch: "ვაკე",
      start: "2025-07-24T09:30:00",
      end: "2025-07-24T09:45:00",
      backgroundColor: "#f56565",
      borderColor: "#f56565",
    },
    {
      id: "3",
      name: "ნინო",
      category: "ზარი",
      branch: "წყალსადენი",
      start: "2024-12-18T14:00:00",
      end: "2024-12-18T15:00:00",
      backgroundColor: "#48bb78",
      borderColor: "#48bb78",
    },
    {
      id: "4",
      name: "ლევანი",
      category: "ტრენინგი",
      branch: "გლდანი",
      start: "2024-12-22T09:00:00",
      end: "2024-12-22T17:00:00",
      backgroundColor: "#9f7aea",
      borderColor: "#9f7aea",
    },
    {
      id: "5",
      name: "მარიამი",
      category: "წვეულება",
      branch: "რუსთავი",
      start: "2024-12-25T18:00:00",
      end: "2024-12-25T19:00:00",
      backgroundColor: "#ed8936",
      borderColor: "#ed8936",
    },
  ],
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload)
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload)
    },
    updateEvent: (state, action) => {
      const { id, updates } = action.payload
      const eventIndex = state.events.findIndex(event => event.id === id)
      if (eventIndex !== -1) {
        state.events[eventIndex] = { ...state.events[eventIndex], ...updates }
      }
    },
  },
})

export const { addEvent, deleteEvent, updateEvent } = eventsSlice.actions
export default eventsSlice.reducer
