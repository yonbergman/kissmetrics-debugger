class KissMetricsDebugger
  wrapped: null
  original: null
  states: ["off", "on", "muted"]
  state: "off"

  constructor: ->
    window._kmq ||= []

  wrapFunction: ->
    @original = window._kmq.push
    newFunc = (event) =>
      @printEvent(event) if @state in ["on","muted"]
      @original(event) if @state in ["on","off"]
    window._kmq.push = newFunc
    unless @wrapped
      @waitForChange()
      @wrapped = window._kmq

  stop: ->
    @state = "off"

  start: ->
    @state = "on"
    @wrapFunction() unless @wrapped

  mute: ->
    @state = "muted"

  printEvent: (event) ->
    switch event[0]
      when "record" then console.log("KM - Track event #{event[1]}", event[2])
      when "identify" then console.log("KM - Identify as #{event[1]}")
      when "set" then console.log("KM - Set Properites", event[1])

  waitForChange: ->
    setTimeout( (=> if window._kmq != @wrapped then @wrapFunction() else @waitForChange()), 1)

window.kmdebugger = new KissMetricsDebugger()