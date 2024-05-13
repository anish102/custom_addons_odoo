/** @odoo-module */
import { loadJS } from "@web/core/assets";
import { getColor } from "@web/views/graph/colors";

const { Component, onWillStart, useRef, onMounted, onWillUnmount } = owl;

export class BarGraph extends Component {
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
      this.renderGraph();
    });

    onWillUnmount(() => {
      if (this.chart) {
        this.chart.destroy();
      }
    });
  }

  renderGraph() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvasRef.el, {
      type: "bar",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.props.label,
            data: this.data,
            backgroundColor: this.color,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true, // Add this line to start the y-axis from 0
              },
            },
          ],
        },
      },
    });
  }
}

BarGraph.template = "estate_property.BarGraph";
