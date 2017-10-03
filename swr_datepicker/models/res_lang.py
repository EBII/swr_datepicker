# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import logging

from odoo import fields, models

_logger = logging.getLogger(__name__)

DEFAULT_YEAR_FORMAT = '%Y'
DEFAULT_MONTH_FORMAT = '%m/%Y'


class Lang(models.Model):
    _inherit = "res.lang"

    year_format = fields.Char(string='Year Format', required=True, default=DEFAULT_YEAR_FORMAT)
    month_format = fields.Char(string='Month Format', required=True, default=DEFAULT_MONTH_FORMAT)
