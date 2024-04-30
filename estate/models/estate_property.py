from datetime import datetime, timedelta

from odoo import api, fields, models
from odoo.exceptions import UserError, ValidationError


class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Estate property model"
    _order = "id desc"

    name = fields.Char(required=True)
    property_type_id = fields.Many2one("estate.property.type", string="Type")
    user_id = fields.Many2one(
        'res.users', string='Salesperson', default=lambda self: self.env.user)
    buyer_id = fields.Many2one("res.partner", string="Buyer")
    tag_ids = fields.Many2many("estate.property.tag", string="Tags")
    offer_ids = fields.One2many(
        "estate.property.offer", "property_id", string="offers")
    description = fields.Text()
    postcode = fields.Char()
    date_availability = fields.Date(
        copy=False,  default=datetime.today() + timedelta(days=90))
    expected_price = fields.Float(required=True)
    selling_price = fields.Float(readonly=True, copy=False)
    bedrooms = fields.Integer(default=2)
    living_area = fields.Integer()
    facades = fields.Integer()
    garage = fields.Boolean()
    garden = fields.Boolean()
    garden_area = fields.Integer()
    garden_orientation = fields.Selection(
        selection=[('north', 'North'), ('south', 'South'), ('east', 'East'), ('west', 'West')])
    active = fields.Boolean('Active', default=True)
    state = fields.Selection(
        selection=[('new', 'New'), ('offer_received', 'Offer Received'), ('offer_accepted', 'Offer Accepted'), ('sold', 'Sold'), ('canceled', 'Canceled')], copy=False, required=True, default='new')
    total_area = fields.Integer(compute="_compute_total_area")
    best_price = fields.Float(compute="_compute_best_offer")
    # status = fields.Char(default="New", readonly=True)

    @api.ondelete(at_uninstall=False)
    def delete(self):
        for record in self:
            if record.state != 'new' and record.state != 'canceled':
                raise UserError(
                    "Only new and canceled properties can be deleted!")
            else:
                return "Property deleted successfully."

    _sql_constraints = [
        ('check_expected_price', 'CHECK(expected_price > 0)',
         'The expected price should be positive.'),
        ('check_selling_price', 'CHECK(selling_price > 0)',
         'The selling price should be positive.')
    ]

    @api.depends("living_area", "garden_area")
    def _compute_total_area(self):
        self.total_area = self.living_area+self.garden_area

    @api.depends("offer_ids.price")
    def _compute_best_offer(self):
        if (self.offer_ids):
            self.best_price = max(self.offer_ids.mapped("price"))
        else:
            self.best_price = 0

    @api.onchange("garden")
    def _onchange_garden(self):
        if (self.garden == True):
            self.garden_area = 10
            self.garden_orientation = 'north'
        elif (self.garden == False):
            self.garden_area = None
            self.garden_orientation = None

    @api.constrains("expected_price", "selling_price")
    def _check_selling_price(self):
        for record in self:
            if record.selling_price > 0 and record.selling_price < ((90/100)*record.expected_price):
                raise ValidationError(
                    "The selling price cannot be less than 90% of the expected price.")

    def action_set_sold(self):
        for record in self:
            if record.state == "canceled":
                raise UserError("Cancelled properties cannot be sold!")
            else:
                record.state = 'sold'

    def action_set_cancel(self):
        for record in self:
            if record.state == "sold":
                raise UserError("Sold properties cannot be cancelled!")
            else:
                record.state = "canceled"


class EstatePropertyType(models.Model):
    _name = "estate.property.type"
    _description = "Estate property type"
    _order = "sequence,name asc"

    name = fields.Char(required=True)
    property_ids = fields.One2many(
        "estate.property", "property_type_id", string="Property ID")
    offer_ids = fields.One2many(
        "estate.property.offer", "property_type_id", string="Property offer Id")
    offer_count = fields.Integer(compute="_compute_count_offer")
    sequence = fields.Integer('Sequence', default=1,
                              help="Used to order stages. Lower is better.")

    _sql_constraints = [
        ('check_name', 'unique(name)',
         'The property tag should be unique.')
    ]

    @api.depends("offer_ids")
    def _compute_count_offer(self):
        for record in self:
            # offers = record.property_ids.mapped("offer_ids")
            record.offer_count = len(record.offer_ids)

    def action_stat_button(self):
        """ This opens the xml view specified in xml_id for the current vehicle """
        self.ensure_one()
        xml_id = self.env.context.get('xml_id')
        if xml_id:

            res = self.env['ir.actions.act_window']._for_xml_id(xml_id)
            res.update(
                context=dict(
                    self.env.context,
                    default_property_type_id=self.id,
                    group_by=False
                ),
                domain=[('property_type_id', '=', self.id)]
            )
            import pdb
            pdb.set_trace()

            return res
        return False


class EstatePropertyTag(models.Model):
    _name = "estate.property.tag"
    _description = "Estate property tag"
    _order = "name asc"

    name = fields.Char(required=True)
    color = fields.Integer()

    _sql_constraints = [
        ('check_name', 'unique(name)',
         'The property tag should be unique.')
    ]


class EstatePropertyOffer(models.Model):
    _name = "estate.property.offer"
    _description = "Estate property offer"
    _order = "price desc"

    price = fields.Float()
    status = fields.Selection(
        selection=[('accepted', 'Accepted'), ('refused', 'Refused')])
    partner_id = fields.Many2one(
        "res.partner", string="Partner", required=True)
    property_id = fields.Many2one(
        "estate.property", string="Property ID", required=True)
    property_type_id = fields.Many2one(
        related='property_id.property_type_id', store=True)
    validity = fields.Integer(
        default=7)
    date_deadline = fields.Date(
        compute="_compute_deadline", inverse="_inverse_compute_deadline")

    @api.model
    def create(self, vals):
        offer = super(EstatePropertyOffer, self).create(vals)
        property = offer.property_id
        property.state = 'offer_received'
        existing_offers = self.search([
            ('property_id', '=', property.id),
            ('price', '>', vals.get('price'))
        ])
        if existing_offers:
            raise UserError(
                "A higher offer already exists for this property!")
        return offer

    _sql_constraints = [
        ('check_offer_price', 'CHECK(offer > 0)',
         'The offer price should be positive.')
    ]

    @ api.depends("create_date", "validity", "date_deadline")
    def _compute_deadline(self):
        for record in self:
            if record.create_date:
                record.date_deadline = record.create_date + \
                    timedelta(days=record.validity)
            else:
                record.date_deadline = fields.Date.today() + timedelta(days=record.validity)

    def _inverse_compute_deadline(self):
        self.validity = (self.date_deadline-self.create_date.date()).days

    def action_offer_accept(self):
        for record in self:
            property = record.property_id
            if property.state == 'new' or property.state == 'offer_received':
                record.status = 'accepted'
                property.state = 'offer_accepted'
                property.selling_price = record.price
                property.buyer_id = record.partner_id

            else:
                raise UserError("An offer already accepted!")

    def action_offer_refuse(self):
        for record in self:
            if record.status == 'accepted':
                raise UserError("A rejected offer cannot be accepted!")
            else:
                record.status = 'refused'


class InheritedModel(models.Model):
    _inherit = 'res.users'

    property_ids = fields.One2many(
        "estate.property", "user_id", string="inerited", domain="['|',('state', '=', 'new'),('state', '=', 'offer_received')]")
