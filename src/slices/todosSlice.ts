import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Todo } from '../types/Todo';

type State = {
  items: Todo[],
  shownTodo: Todo | null,
}

const initialState: State = {
  items: [],
  shownTodo: null,
}

const todosSlice = createSlice({
  name: 'todosSlice',
  initialState,
  reducers: {
    setTodos: (state: State, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
    },
    addTodo: (state: State, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);
    },
    deleteTodo: (state: State, action: PayloadAction<number>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
    toggleTodo: (state: State, action: PayloadAction<number>) => {
      state.items = state.items.map(todo => (
        todo.id === action.payload
          ? {...todo, completed: !todo.completed}
          : todo
      ));
    },
    setShownTodo: (state: State, action: PayloadAction<Todo | null>) => {
      state.shownTodo = action.payload;
    }
  },
})

export default todosSlice.reducer;
export const { setTodos, addTodo, deleteTodo, toggleTodo, setShownTodo } = todosSlice.actions;
