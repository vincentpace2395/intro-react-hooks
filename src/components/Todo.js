import React, { useEffect, useReducer, useRef } from 'react';
import axios from 'axios';

const Todo = props => {
    // const [todoName, setTodoName] = useState('');
    // const [submittedTodo, setSubmittedTodo] = useState(null);
    // const [todoList, setTodoList] = useState([]);
    const todoInputRef = useRef();

    const todoListReducer = (state, action) => {
        switch (action.type) {
            case 'ADD':
                return state.concat(action.payload);
            case 'SET':
                return action.payload;
            case 'REMOVE':
                return state.filter((todo) => todo.id !== action.payload);
            default:
                return state;
        }
    };

    useEffect(() => {
        axios.get('https://react-first-hooks.firebaseio.com/react-first-hooks.json').then(response => {
            const todoData = response.data;
            const todos = [];

            for (const key in todoData) {
                todos.push({ id: key, name: todoData[key].name })
            }

            dispatch({type: 'SET', payload: todos});
        });
        return () => {
            console.log('Cleanup')
        };
    }, []);

    const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
    };

    const [todoList, dispatch] = useReducer(todoListReducer, [], );

    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler);
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        };
    }, []);

    const todoAddHandler = () => {
        const todoName = todoInputRef.current.value;

        axios.post('https://react-first-hooks.firebaseio.com/react-first-hooks.json', {name: todoName})
            .then(response => {
                setTimeout(() => {
                    const todoItem = { id: response.data.name, name: todoName };
                    dispatch({ type: 'ADD', payload: todoItem })
                }, 3000);
            });
    };

    const todoRemoveHandler = todoId => {
        axios.delete(`https://react-first-hooks.firebaseio.com/react-first-hooks/${todoId}.json`)
            .then(response => {
                dispatch({ type: 'REMOVE', payload: todoId });
            });
        dispatch({type: 'REMOVE', payload: todoId});
    };

    return <React.Fragment>
        <input
            type="text"
            placeholder="Todo"
            ref={todoInputRef}
        />
        <button type="button" onClick={todoAddHandler}>
            Add
        </button>
        <ul>
            {todoList.map(
                todo => <li key={todo.id} onClick={todoRemoveHandler.bind(this, todo.id)}>
                    {todo.name}
                </li>)}
        </ul>
    </React.Fragment>;
};

export default Todo;