import { createSelector } from '@reduxjs/toolkit'

export const selectAllEvents = (state) => state.events.events 
export const selectSelectedLocation = (state) => state.filters.selectedLocation
export const selectLocations = (state) => state.filters.locations //selects locations for the top navbar UI

// Filtered events selector
export const selectFilteredEvents = createSelector(
  [selectAllEvents, selectSelectedLocation],
  (events, selectedLocation) => {
    return events.filter(event => event.branch === selectedLocation)
  }
)
