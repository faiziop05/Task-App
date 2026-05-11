import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  todoList: [],
};
const TodoSlice = createSlice({
  initialState,
  name: "Todos",
  reducers: {
    setTodoList(state, action) {
      state.todoList = [...state.todoList, ...action.payload];
    },
  },
});

export const { setTodoList } = TodoSlice.actions;
export default TodoSlice.reducer;
