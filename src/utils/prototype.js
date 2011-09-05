Joshfire.define([], function(_) {

  // ES5 ISO Date Parser Plus toISOString Method by Andrea Giammarchi
  //   Not all browsers supports ISO Date (and ios 4.3 does not)
  function ISO(s){
    var m = /^(\d{4})(-(\d{2})(-(\d{2})(T(\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|((\+|-)(\d{2}):(\d{2}))))?)?)?$/.exec(s);
    if (m === null) return s;
    var d = new Date;
    d.setUTCFullYear(+m[1]);
    d.setUTCMonth(m[3] ? (m[3] >> 0) - 1 : 0);
    d.setUTCDate(m[5] >> 0);
    d.setUTCHours(m[7] >> 0);
    d.setUTCMinutes(m[8] >> 0);
    d.setUTCSeconds(m[10] >> 0);
    d.setUTCMilliseconds(m[12] >> 0);
    if(m[13] && m[13] !== "Z"){
      var h = m[16] >> 0,
      i = m[17] >> 0,
      s = m[15] === "+"
      ;
      d.setUTCHours((m[7] >> 0) + s ? -h : h);
      d.setUTCMinutes((m[8] >> 0) + s ? -i : i);
    };
    return d;
  };

  // Pretty Date - Copyright (c) 2008 John Resig (jquery.com) - MIT license
  function prettyDate(date) {
    var diff = (((new Date()).getTime() - date.getTime()) / 1000)
      , day_diff = Math.floor(diff / 86400);
			
    return (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) ? date :
      (day_diff == 0 && (
          diff < 60 && "just now" ||
          diff < 120 && "1 minute ago" ||
          diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
          diff < 7200 && "1 hour ago" ||
          diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
       day_diff == 1 && "Yesterday" ||
       day_diff < 7 && day_diff + " days ago" ||
       day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago");
  }

  String.prototype.toDateLitteral = function() {
    return prettyDate(ISO(this));
  }

  String.prototype.max = function(max) {
     return (this.length > (max - 3)) ? (this.substr(0, max) +'...') : this;
  };

  Date.prototype.toDateLitteral = function() { return prettyDate(this); }

});

