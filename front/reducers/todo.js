export const initialState = {
  todos: [
    { id: 0, text: 'first', done: true },
    { id: 1, text: 'second', done: true },
    { id: 2, text: 'third', done: true },
  ]
};

const ADD_TODO = 'todo/ADD_TODO';
const TOGGLE_TODO = 'todo/TOGGLE_TODO';

let i = 3;

export const addTodoAction = text => ({
  type: ADD_TODO,
  todo: {
    id: i++, 
    text,
  }
});
export const toggleTodoAction = id => ({
  type: TOGGLE_TODO,
  id
});

const todoReducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_TODO:
      return {
        ...state,
      }
    case 'ADD_TODO_SUCCESS':
      console.log(action);
      return {
        ...state,
        todos: state.todos.concat(action.todo)
      }
    case TOGGLE_TODO:
      console.log('toggle');
      return {
        ...state,
        todos: state.todos.map(todo => action.id === todo.id ? ({ ...todo, done: !todo.done }) : todo)
      };
    default:
      return state;
  }
};

export default todoReducer;
