/** @odoo-module */

import { registry } from "@web/core/registry";
import { memoize } from "@web/core/utils/functions";

export const propertyService = {
  dependencies: ["rpc"],
  async: ["loadStatistics"],
  start(env, { rpc }) {
    return {
      loadStatistics: memoize(() => rpc("/estate_properties/statistics")),
    };
  },
};

registry.category("services").add("propertyService", propertyService);
