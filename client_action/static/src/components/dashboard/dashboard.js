/** @odoo-module **/

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

class EmptyDashboard extends Component {
  static template = "clientaction.EmptyDashboard";
}

registry
  .category("actions")
  .add("client_action.empty_dashboard", EmptyDashboard);
