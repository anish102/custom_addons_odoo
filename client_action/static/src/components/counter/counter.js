/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

class Counter extends Component {
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
}

registry.category("actions").add("client_action.counter", Counter);
