{
    'name': 'ESTATE',
    'depends': [
        'base', 'hr'
    ],
    'application': True,
    'data': [
        'security/ir.model.access.csv',

        'views/estate_property_views.xml',
        'views/estate_property_type.xml',
        'views/estate_property_tag.xml',
        'views/estate_property_offer.xml',
        'views/estate_property_inherited.xml'
    ],
    'assets': {
        'web.assets_backend': [
            'estate/static/src/**/*',
        ],
    }
}
