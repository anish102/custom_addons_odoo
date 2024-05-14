/** @odoo-module **/

import { Component } from "@odoo/owl";

export class StatCard extends Component {
  static template = "estate_propeties.StatCard";

  static props = {
    slots: {
      type: Object,
      shape: {
        default: Object,
        title: { type: Object, optional: true },
      },
    },
  };
}
