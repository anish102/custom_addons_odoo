{
    'name': 'CLIENT_ACTION',
    'depends': ['base', 'web'],
    'data': [
        'views/client_action.xml'
    ],
    'installable': True,
    'auto_install': False,
    'assets': {
        'web.assets_backend': [
            'client_action/static/src/**/**/*.js',
            'client_action/static/src/**/**/*.xml',
        ],
    },
}
