import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AppLayout from "../components/AppLayout";

import { addTodoAction, toggleTodoAction } from '../reducers/todo';
import { addNumberAction } from '../reducers/calc'

function Test() {
  const dispatch = useDispatch();
  const todoItemStyle = useMemo(() => ({
    textDecoration: 'line-through'
  }), [])
  const { todos, number, calculating } = useSelector(({ todo, calc }) => ({
    todos: todo.todos,
    number: calc.number,
    calculating: calc.calculating,
  }))
  const [todoInput, setTodoInput] = useState('')

  const submitTodo = e => {
    e.preventDefault();
    
    if(todoInput === '') return;

    dispatch(addTodoAction(todoInput));
    setTodoInput('');
  }
  const toggleTodo = id => {
    console.log(id)
    dispatch(toggleTodoAction(id));
  }
  const addNumber = () => {
    dispatch(addNumberAction());
  }

  return (
    <AppLayout>
      <h1>test page</h1>
      <div>
        <h2>{number}</h2>
        <div><button onClick={addNumber}>++</button></div>
      </div>
      <div>
        <form onSubmit={submitTodo}>
          <input type="text" value={todoInput} onChange={e => setTodoInput(e.target.value)} />
        </form>
      </div>
      <div>
        { todos && todos.map(todo => (
          <div 
            key={todo.id} style={todo.done ? todoItemStyle : null}
            onClick={() => toggleTodo(todo.id)}
          >{ todo.text }</div>)
        )}
      </div>
    </AppLayout>
  );
}

export default Test;