import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      return JSON.parse(savedTodos)
    } else {
      return []
    }
  })
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editingTodoText, setEditingTodoText] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: uuidv4(), text: newTodo, completed: false }])
      setNewTodo('')
    }
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const startEditing = (todo) => {
    setEditingTodoId(todo.id)
    setEditingTodoText(todo.text)
  }

  const cancelEditing = () => {
    setEditingTodoId(null)
  }

  const updateTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editingTodoText } : todo
      )
    )
    setEditingTodoId(null)
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') {
      return !todo.completed
    } else if (filter === 'completed') {
      return todo.completed
    }
    return true
  })

  return (
    <div className="app">
      <h1>Todo App</h1>
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Add new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            {
              editingTodoId === todo.id ? (
                <div className="editing-wrapper">
                  <input
                    type="text"
                    value={editingTodoText}
                    onChange={(e) => setEditingTodoText(e.target.value)}
                  />
                  <button onClick={() => updateTodo(todo.id)}>Update</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <span>{todo.text}</span>
                  <div className="button-group">
                    <button onClick={() => startEditing(todo)}>Edit</button>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </div>
                </>
              )
            }
          </li>
        ))}
      </ul>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
    </div>
  )
}

export default App