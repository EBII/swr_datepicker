odoo.define('swr.web.datepicker', function(require) {
"use strict";

var core = require('web.core');
var session = require('web.session');
var DatePicker = require('web.datepicker');
var field_utils = require('web.field_utils');
var time = require('web.time');
var basic_fields = require('web.basic_fields');

var _t = core._t;

function getLangDateMonthFormat() {
    return time.strftime_to_moment_format(_t.database.parameters.month_format);
}


function getLangDateYearFormat() {
    return time.strftime_to_moment_format(_t.database.parameters.year_format);
}

function getLangDateFormat(options) {
    if (options.showType) {
        if (options.showType === 'months') {
            return getLangDateMonthFormat();
        } else if (options.showType === 'years') {
            return getLangDateYearFormat();
        }
    }
    return time.getLangDateFormat()
}

function formatDate(value, field, options) {
    if (value === false) {
        return "";
    }
    var date_format = getLangDateFormat(options);
    return value.format(date_format);
}

function parseDate(value, field, options) {
    if (!value) {
        return false;
    }
    var datePattern = getLangDateFormat(options);
    var datePatternWoZero = datePattern.replace('MM', 'M').replace('DD', 'D');
    var date;
    if (options && options.isUTC) {
        date = moment.utc(value);
    } else {
        date = moment.utc(value, [datePattern, datePatternWoZero, moment.ISO_8601], true);
    }
    if (date.isValid()) {
        if (date.year() === 0) {
            date.year(moment.utc().year());
        }
        if (date.year() >= 1900) {
            date.toJSON = function() {
                return this.clone().locale('en').format('YYYY-MM-DD');
            };
            return date;
        }
    }
    throw new Error(_.str.sprintf(core._t("'%s' is not a correct date"), value));
}

DatePicker.DateWidget.include({
        init: function (parent, options) {
            this._super.apply(this, arguments);
            var _options = {};
            if (parent.nodeOptions && (parent.nodeOptions.showType === "months" || parent.nodeOptions.showType === "years")) {
                var l10n = _t.database.parameters;
                _options.viewMode = parent.nodeOptions.showType;
                _options.format = getLangDateFormat(parent.nodeOptions)
            }
            this.options = _.defaults(_options || {}, this.options)
            this.showType = this.options.viewMode;
        },
        _formatClient: function(v) {
            if (this.type_of_date === 'datetime') {
                return this._super.apply(this, arguments);
            }
            return formatDate(v, null, {
                timezone: false,
                showType: this.showType
            });
        },
        _parseClient: function(v) {
            if (this.type_of_date === 'datetime') {
                return this._super.apply(this, arguments);
            }
            return parseDate(v, null, {
                timezone: false,
                showType: this.showType
            });
        },
    });


basic_fields.FieldDate.include({
    _formatValue: function(value) {
        var options = _.extend({}, this.nodeOptions, {
            data: this.recordData
        }, this.formatOptions);
        return formatDate(value, this.field, options);
    },

});

});