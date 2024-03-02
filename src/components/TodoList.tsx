import '../styles/TodoList.scss';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
}

export const TodoList: React.FC<Props> = ({ todos }) => {

  return (
    <div className="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}
