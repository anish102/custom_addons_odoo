from odoo import api, fields, models


class EstatePropertyAccount(models.Model):
    _inherit = 'estate.property'

    def action_set_sold(self):
        res = super().action_set_sold()
        for property in self:
            self.env["account.move"].create(
                {
                    "partner_id": property.buyer_id.id,
                    "move_type": "out_invoice",
                    "invoice_line_ids": [
                        (
                            0,
                            0,
                            {
                                "name": property.name,
                                "quantity": 1.0,
                                "price_unit": property.selling_price * 6.0 / 100.0,
                            },
                        ),
                        (
                            0,
                            0,
                            {
                                "name": "Administrative fees",
                                "quantity": 1.0,
                                "price_unit": 100.0,
                            },
                        ),
                    ],
                }
            )
        return res
