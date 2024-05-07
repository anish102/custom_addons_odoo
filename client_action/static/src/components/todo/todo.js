/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class Todo extends Component {
  static template = "client_action.Todo";

  onClick(ev) {
    this.props.toggleState(this.props.id);
  }

  onDelete(ev) {
    this.props.deleteTodo(this.props.id);
  }

  static props = {
    id: { type: Number },
    description: { type: String },
    done: { type: Boolean },
    toggleState: { type: Function },
    deleteTodo: { type: Function },
  };
}
