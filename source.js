(function() {
  var KissMetricsDebugger;

  KissMetricsDebugger = (function() {

    KissMetricsDebugger.prototype.wrapped = null;

    KissMetricsDebugger.prototype.original = null;

    KissMetricsDebugger.prototype.states = ["off", "on", "muted"];

    KissMetricsDebugger.prototype.state = "off";

    function KissMetricsDebugger() {
      window._kmq || (window._kmq = []);
    }

    KissMetricsDebugger.prototype.wrapFunction = function() {
      var newFunc,
        _this = this;
      this.original = window._kmq.push;
      newFunc = function(event) {
        var _ref, _ref1;
        if ((_ref = _this.state) === "on" || _ref === "muted") {
          _this.printEvent(event);
        }
        if ((_ref1 = _this.state) === "on" || _ref1 === "off") {
          return _this.original(event);
        }
      };
      window._kmq.push = newFunc;
      if (!this.wrapped) {
        this.waitForChange();
        return this.wrapped = window._kmq;
      }
    };

    KissMetricsDebugger.prototype.stop = function() {
      return this.state = "off";
    };

    KissMetricsDebugger.prototype.start = function() {
      this.state = "on";
      if (!this.wrapped) {
        return this.wrapFunction();
      }
    };

    KissMetricsDebugger.prototype.mute = function() {
      return this.state = "muted";
    };

    KissMetricsDebugger.prototype.printEvent = function(event) {
      switch (event[0]) {
        case "record":
          return console.log("KM - Track event " + event[1], event[2]);
        case "identify":
          return console.log("KM - Identify as " + event[1]);
        case "set":
          return console.log("KM - Set Properites", event[1]);
      }
    };

    KissMetricsDebugger.prototype.waitForChange = function() {
      var _this = this;
      return setTimeout((function() {
        if (window._kmq !== _this.wrapped) {
          return _this.wrapFunction();
        } else {
          return _this.waitForChange();
        }
      }), 1);
    };

    return KissMetricsDebugger;

  })();

  window.kmdebugger = new KissMetricsDebugger();

}).call(this);
