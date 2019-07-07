import React, { useState, useEffect, useReducer, useRef, useMemo } from 'react';
import axios from 'axios';

import List from './List';
import { useFormInput } from '../hooks/forms';

const Todo = props => {
    const [inputIsValid, setInputIsValid] = useState(false);
    const todoInputRef = useRef();
    const todoInput = useFormInput();

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

    const inputValidationHandler = event => {
        if (event.target.value.trim() === '') {
            setInputIsValid(false);
        }
        else {
            setInputIsValid(true);
        }
    };

    const [todoList, dispatch] = useReducer(todoListReducer, [], );

    const todoAddHandler = () => {
        const todoName = todoInput.value;

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
            onChange={todoInput.onChange}
            value={todoInput.value}
            style={{ backgroundColor: todoInput.validity === true ? 'transparent' : 'red' }}
        />
        <button type="button" onClick={todoAddHandler}>
            Add
        </button>
        {useMemo(
            () => (
                <List items={todoList} onClick={todoRemoveHandler} />
            ),[todoList]
        )}
    </React.Fragment>
};

export default Todo;