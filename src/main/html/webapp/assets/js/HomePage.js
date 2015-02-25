// Static Page Controller

Counter = can.Model({
 findOne : 'GET /counters'
}, {

});


HomePage = can.Control({

 "init" : function(element, options) {
  that = this;
  Counter.findOne({}, function(counter) {
   that.element.hide();
   that.element.html(can.view('/static/home.ejs',{counter: counter}));
   that.element.fadeIn();
   if (options.login) {
    new UserLoginForm("#login-form");
   }
  }, function(message) {

  });
 }

});