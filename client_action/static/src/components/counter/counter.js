/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { ChildCounter } from "../counter_sub/counter_sub";
import { TodoList } from "../todo_list/todo_list";

export class Counter extends Component {
  static template = "client_action.Counter";

  setup() {
    this.state = useState({ value: 0 });
  }

  increment() {
    this.state.value++;
  }

  decrement() {
    this.state.value--;
  }

  static components = { ChildCounter, TodoList };
}

registry.category("actions").add("client_action.counter", Counter);
