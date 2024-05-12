# -*- coding: utf-8 -*-

import logging

from odoo import http
from odoo.http import request

logger = logging.getLogger(__name__)


class EstateController(http.Controller):

    @ http.route('/estate_properties/statistics', type='json', auth='user')
    def get_statistics(self):
        return http.request.env['estate.property'].get_statistics()
