import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import {
  ThemeProvider,
  createTheme,
  FormControl,
  TextField,
  FormHelperText,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  IconButton,
  Button
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const theme = createTheme({
  palette: {
    primary: { main: '#000000' },
  },
});

const TodoList = ({ todos, completeTodo, editTodo, deleteTodo, saveTodo, noteRef, preventSubmit }) => {
  const [checked, setChecked] = useState([]);
  let UniqKey = 123;

  const handleToggle = (value, inx) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    completeTodo(inx);
  };

  return (
    <ThemeProvider theme={theme}>
      <List sx={{ width: '100%', backgroundColor: '#f5f5f5', padding: 0 }}>
        {todos.map((todo, inx) => {
          const labelId = `list-todo-${todo.text}`;

          return (
            <ListItem
              key={`todo-${UniqKey++}`}
              dense
              button
              sx={{ borderBottom: '1px dashed black' }}
            >
              <ListItemIcon>
                <Checkbox
                  color="primary"
                  edge="start"
                  checked={checked.indexOf(todo) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  onClick={handleToggle(todo, inx)}
                  onKeyPress={preventSubmit}
                />
              </ListItemIcon>
              {!todo.isEditing ? (
                <>
                  <ListItemText
                    id={labelId}
                    primary={todo.text}
                    sx={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}
                  />
                  <ListItemIcon>
                    <IconButton edge="end" aria-label="edit" onClick={() => editTodo(inx)}>
                      <EditIcon />
                    </IconButton>
                  </ListItemIcon>
                </>
              ) : (
                <>
                  <label htmlFor="task" className="visuallyhidden">
                    {todo.text}
                  </label>
                  <input
                    className="form__edit-input"
                    defaultValue={todo.text}
                    ref={(element) => (noteRef.current[inx] = element)}
                    onKeyPress={preventSubmit}
                    id="task"
                  />
                  <ListItemIcon>
                    <IconButton onClick={() => saveTodo(inx)} edge="end" aria-label="save">
                      <BookmarkIcon />
                    </IconButton>
                  </ListItemIcon>
                </>
              )}
              <ListItemSecondaryAction>
                <IconButton onClick={() => deleteTodo(inx)} edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </ThemeProvider>
  );
};

const TodoCreator = ({ todo, setTodo, clearInput, inputRef, isInputEmpty, preventSubmit }) => {
  return (
    <div className="form__input">
      <ThemeProvider theme={theme}>
        <FormControl>
          <TextField
            id="outlined-basic"
            label="What's need to be done?"
            value={todo}
            variant="outlined"
            onChange={(e) => setTodo(e.target.value)}
            onFocus={clearInput}
            inputRef={inputRef}
            aria-describedby="component-error-text"
            onKeyPress={preventSubmit}
          />
          {isInputEmpty && (
            <FormHelperText id="component-error-text">Task can't be empty</FormHelperText>
          )}
        </FormControl>
        <Button type="submit" alt="add-note" onKeyPress={preventSubmit}>
          Add task
        </Button>
      </ThemeProvider>
    </div>
  );
};

const Form = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([
    { text: 'Learn about React', isCompleted: false, isEditing: false },
    { text: 'Meet friend for lunch', isCompleted: false, isEditing: false },
    { text: 'Build really cool todo app', isCompleted: false, isEditing: false }
  ]);
  const inputRef = useRef();
  const noteRef = useRef({});
  const [isInputEmpty, setInputEmpty] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(newTodo);
    clearInput();
    inputRef.current.focus();
  };

  const preventSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const addTodo = (text) => {
    if (text !== '') {
      const newTodos = [...todos, { text }];
      setNewTodo('');
      setTodos(newTodos);
    } else {
      setInputEmpty(true);
    }
  };

  const removeTodo = (inx) => {
    const newArr = [...todos];
    newArr.splice(inx, 1);
    setTodos(newArr);
  };

  const completeTodo = (inx) => {
    const newTodos = [...todos];
    newTodos[inx].isCompleted = !newTodos[inx].isCompleted;
    setTodos(newTodos);
  };

  const editTodo = (inx) => {
    const newTodos = [...todos];
    newTodos[inx].isEditing = !newTodos[inx].isEditing;
    setTodos(newTodos);
  };

  const saveTodo = (inx) => {
    const newTodos = [...todos];
    newTodos[inx].isEditing = false;
    newTodos[inx].text = noteRef.current[inx].value;
    setTodos(newTodos);
  };

  const clearInput = () => {
    setNewTodo('');
  };

  const setTodo = (todo) => {
    setInputEmpty(false);
    setNewTodo(todo);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <TodoCreator
        todo={newTodo}
        setTodo={setTodo}
        clearInput={clearInput}
        inputRef={inputRef}
        isInputEmpty={isInputEmpty}
        preventSubmit={preventSubmit}
      />
      <TodoList
        todos={todos}
        completeTodo={completeTodo}
        editTodo={editTodo}
        deleteTodo={removeTodo}
        saveTodo={saveTodo}
        noteRef={noteRef}
        preventSubmit={preventSubmit}
      />
    </form>
  );
};

function App() {
  return (
    <div className="wrapper">
      <h1>Todo List</h1>
      <Form />
    </div>
  );
}



// function Parent(){
//   const [name,setName] = useState('')
//   const onInputChange = (value) =>{
//     setName(value)
//   }
//   return (
//   <>
//   <Child  fun = {onInputChange}/>
//   <p>{name}</p>
//   </>
//   )

// }
// const Child = (prob) => {
//   const {fun} = prob
//   return (
//     <input type='text' onChange={(e) =>fun(e.target.value)}>
//     </input>
//   )
// }

// function App(){

//   return (
//     <Parent/>
//   )

// }

export default App;
