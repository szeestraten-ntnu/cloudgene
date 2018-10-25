import ejs from 'can-ejs';
import dateFormat from 'dateformat';
import domData from 'can-util/dom/data/data';
import stache from 'can-stache';


stache.registerHelper('truncate', function(str, len) {
  if (str.length > len) {
    var new_str = str.substr(0, len + 1);

    while (new_str.length) {
      var ch = new_str.substr(-1);
      new_str = new_str.substr(0, -1);

      if (ch == ' ') {
        break;
      }
    }

    if (new_str == '') {
      new_str = str.substr(0, len);
    }

    return new_str + '...';
  }
  return str;
});

stache.registerHelper('percentage', function(value, total) {
  return (value / total) * 100;
});


stache.registerHelper('prettyTime', function(executionTime) {
  if (!executionTime || executionTime <= 0) {

    return '-';

  } else {

    var h = (Math.floor((executionTime / 1000) / 60 / 60));
    var m = ((Math.floor((executionTime / 1000) / 60)) % 60);

    return (h > 0 ? h + ' h ' : '') + (m > 0 ? m + ' min ' : '') +
      ((Math.floor(executionTime / 1000)) % 60) + ' sec';

  }

});

String.prototype.endsWith = function(s) {
  return this.length >= s.length && this.substr(this.length - s.length) == s;
};

stache.registerHelper('prettyDate', function(unixTimestamp) {
  if (unixTimestamp > 0) {
    var dt = new Date(unixTimestamp);
    return dateFormat(dt, "default");
  } else {
    return '-';
  }
});

stache.registerHelper('isImage', function(str, options) {
  var image = str.endsWith('png') ||  str.endsWith('jpg') || str.endsWith('gif');
  if (image){
    return options.fn();
  }else{
    return options.inverse();
  }
});

stache.registerHelper('isParamChecked', function(param, options) {
  var value = param.attr('value');
  var result = options.inverse();
  param.attr('values').each(function(item){
    if (item.attr('key') === 'true'){
      if (item.attr('value') === value){
        result = options.fn();
        return;
      }else{
        result = options.inverse();
        return;
      }
    }
  });
  return result;
});

stache.registerHelper('getParamTrueValue', function(param, options) {
  var result = '??';
  param.attr('values').each(function(item){
    if (item.attr('key') === 'true'){
        result = item.attr('value');
        return;
      }
  });
  return result;
});

stache.registerHelper('getParamFalseValue', function(param, options) {
  var result = '??';
  param.attr('values').each(function(item){
    if (item.attr('key') === 'false'){
        result = item.attr('value');
        return;
      }
  });
  return result;
});

ejs.Helpers.prototype.can = {};
ejs.Helpers.prototype.can.data = function(el, key, value) {
  domData.set.call(el, key, value);
}

ejs.Helpers.prototype.prettyState = function(state) {

  if (this.state == 1) {
    return 'Waiting';
  } else if (this.state == 2) {
    return 'Running';
  } else if (this.state == 3) {
    return 'Exporting Data';
  } else if (this.state == 4) {
    return 'Complete';
  } else if (this.state == 5) {
    return 'Error';
  } else if (this.state == 6) {
    return 'Canceled';
  } else {
    return 'Error';
  }

};

ejs.Helpers.prototype.prettyTime = function(start, end, current) {

  if (start === 0 && end === 0) {
    return '-';
  }

  var executionTime = 0;
  if (start > 0 && end === 0) {
    executionTime = current - start;
  } else {
    executionTime = end - start;
  }

  if (executionTime <= 0) {

    return '-';

  } else {

    var h = (Math.floor((executionTime / 1000) / 60 / 60));
    var m = ((Math.floor((executionTime / 1000) / 60)) % 60);

    return (h > 0 ? h + ' h ' : '') + (m > 0 ? m + ' min ' : '') +
      ((Math.floor(executionTime / 1000)) % 60) + ' sec';

  }

};

ejs.Helpers.prototype.prettyDate = function(unixTimestamp) {

  if (unixTimestamp > 0) {
    var dt = new Date(unixTimestamp);
    return dateFormat(dt, "default");
  } else {
    return '-';
  }

};

ejs.Helpers.prototype.getClassByJob = function(job) {
  if (job.attr('state') == '-1') {
    return 'job-dark';
  }
  if (job.attr('state') == '1') {
    if (job.attr('setupRunning')) {
      return 'job-secondary';
    } else {
      return 'job-secondary';
    }
  }
  if (job.attr('state') == '2') {
    return 'job-primary';
  }
  if (job.attr('state') == '3') {
    return 'job-primary';
  }
  if (job.attr('state') == '4' || job.attr('state') == '8') {
    return 'job-success';
  }
  if (job.attr('state') == '5') {
    return 'job-danger';
  }
  if (job.attr('state') == '6') {
    return 'job-danger';
  }
  if (job.attr('state') == '7') {
    return 'job-dark';
  }
};
