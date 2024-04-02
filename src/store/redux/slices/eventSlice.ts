import { createSlice } from '@reduxjs/toolkit'

const eventSlice = createSlice({
    name: 'eventSlice',
    initialState: {
        selectedEventsIds:[],
        eventsListAreLoading:false
    },
    reducers: {
        setSelectedEventsIds(state, {payload}) {
            state.selectedEventsIds =  payload
        },
        setEventsListAreLoading(state, {payload}) {
            state.eventsListAreLoading =  payload
        }
    },
})

export const { setSelectedEventsIds,setEventsListAreLoading } = eventSlice.actions
export default eventSlice.reducer