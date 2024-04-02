import { configureStore } from '@reduxjs/toolkit'
import attendanceSlice from './redux/slices/attendaceSlice'
import eventSlice from './redux/slices/eventSlice'

export const store = configureStore({
    reducer: {
        attendanceSlice,
        eventSlice
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch