# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import json
import locale
import logging
import re
from operator import itemgetter

from odoo import api, fields, models, tools, _
from odoo.tools.safe_eval import safe_eval
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)

DEFAULT_YEAR_FORMAT = '%Y'
DEFAULT_MONTH_FORMAT = '%m/%Y'


class Lang(models.Model):
    _inherit = "res.lang"

    year_format = fields.Char(string='Year Format', required=True, default=DEFAULT_YEAR_FORMAT)
    month_format = fields.Char(string='Month Format', required=True, default=DEFAULT_MONTH_FORMAT)
