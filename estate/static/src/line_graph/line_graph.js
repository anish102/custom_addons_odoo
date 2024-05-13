/** @odoo-module */

import { loadJS } from "@web/core/assets";
import { getColor } from "@web/views/graph/colors";

const { Component, onWillStart, useRef, onMounted, onWillUnmount } = owl;

export class LineGraph extends Component {
  setup() {
    this.canvasRef = useRef("canvas");

    this.labels = Object.keys(this.props.data);
    this.data = Object.values(this.props.data);
    this.color = this.labels.map((_, index) => {
      return getColor(index);
    });

    onWillStart(() => {
      return loadJS(["/web/static/lib/Chart/Chart.js"]);
    });

    onMounted(() => {
      this.renderChart();
    });

    onWillUnmount(() => {
      if (this.chart) {
        this.chart.destroy();
      }
    });
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvasRef.el, {
      type: "line",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.props.label,
            data: this.data,
            borderColor: "blue",
            fill: false,
          },
        ],
      },
    });
  }
}

LineGraph.template = "estate_property.LineGraph";
