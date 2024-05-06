/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class Todo extends Component {
  static template = "client_action.Todo";

  static props = {
    id: { type: Number },
    description: { type: String },
    done: { type: Boolean },
  };
}
