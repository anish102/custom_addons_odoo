/** @odoo-module **/

import { Component, useSubEnv, onWillStart } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Domain } from "@web/core/domain";
import { Card } from "./card/card";
import { PieChart } from "./pie_chart/pie_chart";
import { getDefaultConfig } from "@web/views/view";
import { BarGraph } from "./bar_graph/bar_graph";
import { LineGraph } from "./line_graph/line_graph";

class EstateDashboard extends Component {
  setup() {
    useSubEnv({
      config: {
        ...getDefaultConfig(),
        ...this.env.config,
      },
    });

    this.action = useService("action");
    this.propertyService = useService("propertyService");

    this.display = {
      controlPanel: { "top-right": false, "bottom-right": false },
    };

    this.keyToString = {
      total_properties: "Total number of properties",
      properties_with_garden: "Properties with garden",
      properties_with_garage: "Properties with garage",
      most_expensive_property: "Most expensive property",
      most_cheap_property: "Cheapest property",
    };

    onWillStart(async () => {
      this.statistics = await this.propertyService.loadStatistics();
    });
  }

  openBuyers() {
    this.action.doAction("base.action_partner_form");
  }

  openEstateProperties(title, domain) {
    this.action.doAction({
      type: "ir.actions.act_window",
      name: title,
      res_model: "estate.property",
      domain: new Domain(domain).toList(),
      views: [
        [false, "list"],
        [false, "form"],
      ],
    });
  }

  openLast7DaysNewEstateProperties() {
    let domain =
      '[("create_date",">=",(context_today() - datetime.timedelta((days = 7))).strftime("%Y-%m-%d")),("state", "=", "new")]';
    this.openEstateProperties("Last 7 days new properties", domain);
  }

  openSoldProperties() {
    let domain = '[("state", "=", "sold")]';
    this.openEstateProperties("Sold properties", domain);
  }
}

EstateDashboard.components = { Layout, Card, PieChart, BarGraph, LineGraph };
EstateDashboard.template = "estate.clientaction";

registry.category("actions").add("estate.dashboard", EstateDashboard);
