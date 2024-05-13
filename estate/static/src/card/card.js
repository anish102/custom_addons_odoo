/** @odoo-module **/

import { Component } from "@odoo/owl";

export class Card extends Component {
  static template = "estate_propeties.Card";

  static props = {
    slots: {
      type: Object,
      shape: {
        default: Object,
        title: { type: Object, optional: true },
      },
    },
    className: {
      type: String,
      optional: true,
    },
  };
}
