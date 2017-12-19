odoo.define('swr.web.datepicker', function (require) {
"use strict";

var core = require('web.core');
var DatePicker = require('web.datepicker');
var formats = require('web.formats');
var time = require('web.time');

var _t = core._t;

DatePicker.DateWidget.include({
        init: function (parent, options) {
            this._super.apply(this, arguments);
            var _options = {};
            if (parent.options && (parent.options.showType==="months" || parent.options.showType==="years")) {
                var l10n = _t.database.parameters;
                _options.showType = parent.options.showType;
                _options.viewMode = parent.options.showType;
                _options.minViewMode = parent.options.showType;
                _options.format = time.strftime_to_moment_format((parent.options.showType==="months")? l10n.month_format : l10n.year_format)
            }
            this.options = _.defaults(_options || {}, this.options)
        },
        format_client: function(v) {
            return formats.format_value(v, {"widget": this.type_of_date, "options": this.options});
        },
        parse_client: function(v) {
            return formats.parse_value(v, {"widget": this.type_of_date, "options": this.options});
        }
    });
return DatePicker;
})

odoo.define('swr.web.formats', function (require) {
"use strict";

    var core = require('web.core');
    var webFormats = require('web.formats');
    var time = require('web.time');
    var origin_format_value = webFormats.format_value;
    var origin_parse_value = webFormats.parse_value;

    var _t = core._t;

    webFormats.format_value = function (value, descriptor, value_if_empty) {
        var options = descriptor.options;
        if ((descriptor.widget || descriptor.type || (descriptor.field && descriptor.field.type)) === 'date'){
            if (typeof options === 'string') {
                try {
                    options = JSON.parse(options)
                } catch(e) {
                    console.log(e)
                }
            }
            if (typeof options === 'object'){
                if (value && (options.showType === 'months' || options.showType === 'years')){
                    var l10n = _t.database.parameters;
                    var _format = time.strftime_to_moment_format((options.showType==="months")? l10n.month_format : l10n.year_format)
                    return moment(value).format(_format);
                }
            }
        }
        return origin_format_value(value, descriptor, value_if_empty);
    }

    webFormats.parse_value = function (value, descriptor, value_if_empty) {
        var options = descriptor.options;
        if ((descriptor.widget || descriptor.type || (descriptor.field && descriptor.field.type)) === 'date'){
            if (typeof options === 'string') {
                 try {
                    options = JSON.parse(options)
                 } catch(e) {
                    console.log(e)
                 }
            }
            if (typeof options === 'object'){
                if (options.showType === 'months' || options.showType === 'years'){
                    var l10n = _t.database.parameters;
                    var _format = time.strftime_to_moment_format(options.showType === 'months'? l10n.month_format : l10n.year_format);
                    var date_pattern = _format;
                    var date_pattern_wo_zero = date_pattern.replace('MM','M').replace('DD','D');
                    var date = moment(value, [date_pattern, date_pattern_wo_zero, moment.ISO_8601], true);
                    if (date.isValid() && date.year() >= 1900)
                        return time.date_to_str(date.toDate());
                    date = moment(value, [date_pattern, date_pattern_wo_zero, moment.ISO_8601]);
                    if (date.isValid()) {
                        if (date.year() === 0) {
                            date.year(moment.utc().year());
                        }
                        if (date.year() >= 1900) {
                            return time.date_to_str(date.toDate());
                        }
                    }
                    if(value){
                        throw new Error(_.str.sprintf(_t("'%s' is not a correct date"), value));
                    }
                }
            }
        }
        return origin_parse_value(value, descriptor, value_if_empty);
    }

})

