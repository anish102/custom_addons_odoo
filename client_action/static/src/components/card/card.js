/** @odoo-module **/

import { Component } from "@odoo/owl";

export class Card extends Component {
  static template = "client_action.Card";

  static props = {
    slots: {
      type: Object,
      shape: {
        content: Object,
        title: { type: Object, optional: true },
      },
    },
  };
}
