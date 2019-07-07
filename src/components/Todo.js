import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = props => {
    const [todoName, setTodoName] = useState('');
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        axios.get('https://react-first-hooks.firebaseio.com/react-first-hooks.json').then(response => {
            console.log(response);
            const todoData = response.data;
            const todos = [];

            for (const key in todoData) {
                todos.push({id: key, name: todoData[key].name})
            }

            setTodoList(todos);
        });
        return () => {
            console.log('Cleanup')
        };
    }, [todoName]);

    const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
    };


    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler);
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        };
    });


    const inputChangeHandler = event => {
        setTodoName(event.target.value);
    };

    const todoAddHandler = () => {
        setTodoList(todoList.concat(todoName));
        axios.post('https://react-first-hooks.firebaseio.com/react-first-hooks.json', {name: todoName})
            .then(response => {
                console.log(response);
            });
    };

    return <React.Fragment>
        <input
            type="text"
            placeholder="Todo"
            onChange={inputChangeHandler}
            value={todoName}
        />
        <button type="button" onClick={todoAddHandler}>
            Add
        </button>
        <ul>
            {todoList.map(
                todo => <li key={todo.id}>{todo.name}</li>)}
        </ul>
    </React.Fragment>;
};

export default Todo;