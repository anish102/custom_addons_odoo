/** @odoo-module **/

import { Component } from "@odoo/owl";

export class ChartCard extends Component {
  static template = "estate_propeties.ChartCard";

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
