/** @odoo-module **/

import { Component, useState, useRef, onMounted } from "@odoo/owl";
import { Todo } from "../todo/todo";

export class TodoList extends Component {
  static template = "client_action.TodoList";

  setup() {
    this.todoList = useState([]);
    this.inputRef = useRef("inputRef");
    onMounted(() => {
      this.inputRef.el.focus();
    });
  }

  addTodo(ev) {
    if (ev.keyCode === 13 && ev.target.value !== "") {
      this.todoList.push({
        id: this.todoList.length + 1,
        description: ev.target.value,
        done: false,
      });
      ev.target.value = "";
    }
  }

  toggleTodo(todoId) {
    const todo = this.todoList.find((todo) => todo.id === todoId);
    if (todo) {
      todo.done = !todo.done;
    }
  }

  removeTodo(todoId) {
    const todoIndex = this.todoList.findIndex((todo) => todo.id === todoId);
    if (todoIndex >= 0) {
      this.todoList.splice(todoIndex, 1);
    }
    this.todoList.forEach((todo, index) => {
      todo.id = index + 1;
    });
  }

  static components = { Todo };
}
