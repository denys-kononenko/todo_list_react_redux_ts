import './styles/_reset.scss';
import './styles/App.scss';
import { Button, ButtonGroup, Input, Modal, ModalClose, ModalDialog, Switch, Textarea, Typography } from '@mui/joy';
import { TodoList } from './components/TodoList';
import { addTodo, setShownTodo, setTodos } from './slices/todosSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useEffect, useRef, useState } from 'react';
import { ActiveFilter } from './types/ActiveFilter';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeFilter, setActiveFilter] = useState(ActiveFilter.All);
  const [hasError, setHasError] = useState(false);
  const [isTextareaShown, setIsTextareaShown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const errorTimeoutID = useRef(0);

  const { todos } = useAppSelector(state => state);
  const dispatch = useAppDispatch();

  const visibleTodos = todos.items.filter(todo => {
    switch (activeFilter) {
      case ActiveFilter.Active:
      return !todo.completed;

      case ActiveFilter.Completed:
        return todo.completed;

      case ActiveFilter.All:
      default: 
        return true;
    }
  })

  useEffect(() => {
    try {
      dispatch(setTodos(JSON.parse(localStorage.getItem('todos') || '[]')));
    } catch {
      localStorage.removeItem('todos');
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos.items));
  }, [todos.items]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      window.clearTimeout(errorTimeoutID.current);
      setHasError(true);
      errorTimeoutID.current = window.setTimeout(() => {
        setHasError(false);
      }, 3000);
      setTitle('');

      return;
    }

    dispatch(addTodo({
      id: Date.now(),
      title: title.trim(),
      description: isTextareaShown ? description.trim() : '',
      completed: false,
    }))

    setTitle('');
    setDescription('');
    setIsTextareaShown(false);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    setHasError(false);
  }

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTextareaShown(event.target.checked);
  }

  useEffect(() => {
    if (isTextareaShown) {
    textareaRef.current?.focus();
    }
  }, [isTextareaShown])

  return (
    <div className="App">
      <div className="App__list-wrapper">
        <form onSubmit={handleFormSubmit}>
          <div className="App__input-wrapper">
            <Input
              className="App__input"
              value={title}
              onChange={handleInputChange}
              placeholder={hasError ? 'Cannot be empty' : 'Add todo'}
              color={hasError ? 'danger' : 'neutral'}
            />

            <Button type="submit">Add</Button>
          </div>

          <Switch
            size="sm"
            endDecorator="Add description"
            onChange={handleSwitchChange}
            checked={isTextareaShown}
          />

          {isTextareaShown && (
            <Textarea
              slotProps={{ textarea: { ref: textareaRef } }}
              minRows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          )}
        </form>

        <TodoList todos={visibleTodos} />

        {!!todos.items.length && (
          <ButtonGroup className="App__buttons">
            {Object.values(ActiveFilter).map(filterValue => (
              <Button
                key={filterValue}
                onClick={() => setActiveFilter(filterValue)}
                color={activeFilter === filterValue ? 'primary' : 'neutral'}
                variant="plain"
              >
                {filterValue}
              </Button>
            ))}
          </ButtonGroup>
        )}
      </div>

      <Modal
        open={!!todos.shownTodo}
        onClose={() => dispatch(setShownTodo(null))}
      >
        <ModalDialog>
          <ModalClose />

          <Typography
            component="h2"
            level="h4"
            fontWeight="lg"
          >
            {todos.shownTodo?.title}
          </Typography>

          <Typography>
            {todos.shownTodo?.description}
          </Typography>
        </ModalDialog>
      </Modal>
    </div>
  );
}

export default App;
