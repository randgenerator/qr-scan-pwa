import { createSlice } from '@reduxjs/toolkit'

const attendanceSlice = createSlice({
    name: 'attendanceSlice',
    initialState: {
        asyncAttendancesLoading:false,
        attendanceLoadedEvents:[],
        attendanceListAreLoaded:false
    },
    reducers: {
        setIsAttendancesLoading(state, {payload}) {
            state.asyncAttendancesLoading =  payload
        },
        setAttendanceLoadedEvents(state, {payload}) {
            state.attendanceLoadedEvents =  payload
        },
        setAttendanceListAreLoaded(state, {payload}) {
            state.attendanceListAreLoaded =  payload
        }
    },
})

export const { setIsAttendancesLoading,setAttendanceLoadedEvents,setAttendanceListAreLoaded } = attendanceSlice.actions
export default attendanceSlice.reducer