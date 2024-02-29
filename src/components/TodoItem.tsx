import '../styles/TodoItem.scss';
import { Checkbox, IconButton } from '@mui/joy';
import { Todo } from '../types/Todo';
import { Visibility, DeleteForever } from '@mui/icons-material';
import { toggleTodo, deleteTodo, setShownTodo } from '../slices/todosSlice';
import { useAppDispatch } from '../app/hooks';
import classNames from 'classnames';

type Props = {
  todo: Todo,
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="TodoItem">
      <Checkbox
        className="TodoItem__checkbox"
        onChange={() => dispatch(toggleTodo(todo.id))}
        checked={todo.completed}
      />

      <p
        className={classNames('TodoItem__title', {
          TodoItem__completed: todo.completed,
        })}
      >
        {todo.title}
      </p>

      <div className="TodoItem__buttons">
        {todo.description && (
          <IconButton onClick={() => dispatch(setShownTodo(todo))}>
            <Visibility color="primary" />
          </IconButton>
        )}
        
        <IconButton onClick={() => dispatch(deleteTodo(todo.id))}>
          <DeleteForever color="error" />
        </IconButton>
      </div>
    </div>
  )
}
