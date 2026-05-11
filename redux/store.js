import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './loginSlice'
import TodoSlice from './TodoSlice'
export default configureStore({
  reducer: {
    loginstatus:loginSlice,
    todoslice:TodoSlice
  },
})