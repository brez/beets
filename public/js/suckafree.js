/*
 * Sucka Free! Flow Process Mixer
 * brez!
 * The Barbarian Group v. SRM
 */

/*jslint indent: 2, newcap: true, browser: true */

(function () {
  "use strict";
  var context,
    LOOP = 2682, //2.683 seconds
    bass = [
      {name: 'bass1', url: '/audio/bass/bass1.ogg'},
      {name: 'bass2', url: '/audio/bass/bass2.ogg'},
      {name: 'bass3', url: '/audio/bass/bass3.ogg'},
      {name: 'bass4', url: '/audio/bass/bass4.ogg'},
      {name: 'bass5', url: '/audio/bass/bass5.ogg'},
      {name: 'bass6', url: '/audio/bass/bass6.ogg'},
      {name: 'bass7', url: '/audio/bass/bass7.ogg'},
      {name: 'bass8', url: '/audio/bass/bass8.ogg'},
      {name: 'bass9', url: '/audio/bass/bass9.ogg'}
    ],
    beets = [
      {name: 'beet1', url: '/audio/beets/beet1.ogg'},
      {name: 'beet2', url: '/audio/beets/beet2.ogg'},
      {name: 'beet3', url: '/audio/beets/beet3.ogg'},
      {name: 'beet4', url: '/audio/beets/beet4.ogg'},
      {name: 'beet5', url: '/audio/beets/beet5.ogg'},
      {name: 'beet6', url: '/audio/beets/beet6.ogg'},
      {name: 'beet7', url: '/audio/beets/beet7.ogg'},
      {name: 'beet8', url: '/audio/beets/beet8.ogg'},
      {name: 'beet9', url: '/audio/beets/beet9.ogg'}
    ],
    audioEventNode,
    analyser,
    canvasContext;

  function init() {
    if (typeof AudioContext !== "undefined") {
      context = new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
      context = new webkitAudioContext();
    } else {
      alert("You gotta use Chrome sucka!");
    }
  }

  function initAnimation() {
    canvasContext = $("#canvas").get()[0].getContext("2d");
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.2;
    analyser.fftSize = 512;
    audioEventNode = context.createJavaScriptNode(2048, 1, 1);
    audioEventNode.connect(context.destination);
   /* audioEventNode.onaudioprocess = function() {
      var array =  new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      canvasContext.clearRect(0, 0, 1000, 325);
      for ( var i = 0; i < (array.length); i++ ){
        var value = array[i];
        canvasContext.fillStyle="#FFFF00";
        canvasContext.fillRect(i*5,325-value,3,325);
      }
    } */
  }

  //Pad represents a single Pad on a Bank of sounds
  var Pad = function Pad(source) {
    this.source = source;
    this.playing = false;
  };

  Pad.prototype = {
    load: function load() {
      var request = new XMLHttpRequest();
      var source = this.source;
      request.open("GET", source.url, true);
      request.responseType = "arraybuffer";
      request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
          source.buffer = buffer;
        }, function(err) { console.log("err(decodeAudioData): "+err); });
      };
      request.send();
    },
    play: function play() {
      var source = context.createBufferSource();
      source.buffer = this.source.buffer;
      source.connect(context.destination);
      source.connect(analyser);
      source.loop = true;
      source.noteOn(context.currentTime);
      this.buffer = source;
      this.source.playing = true;
    },
    stop: function stop() {
      this.buffer.noteOff(context.currentTime);
      this.source.playing = false;
    }
  };

  //Bank represents a bank of (currently) 9 pads
  var Bank = function Bank(bank) {
    var pads = {};
    $.each(bank, function (i, pad) {
      pad.source = new Pad(pad);
      pad.source.load();
      pads[pad.name] = pad;
    });
    this.pads = pads;
  };

  Bank.prototype = {
    toggle: function toggle(name, callback) {
      if (this.active) {
        this.active.source.stop();
        if (this.active.name == name) {
          this.active = undefined;
          callback();
          return;
        }
      }
      this.pads[name].source.play();
      this.active = this.pads[name];
    },
    timer: function timer(name, callback) {
      var count = 0;
      if (this.timerId) {
        clearInterval(this.timerId)
        if (this.timerName == name) {
          this.timerName = undefined;
          return;
        }
      }
      callback(1); //This is done wrong, I should be using AudioProcess events, v2!
      this.timerId = setInterval(function() {
        switch(count++%4) {
          case 0: callback(2);
          break;
          case 1: callback(3);
          break;
          case 2: callback(4);
          break;
          case 3: callback(1);
          break;
        }
      }, LOOP/4);
      this.timerName = name;
    }
  };

  init();
  initAnimation();

  var bassBank = new Bank(bass),
    beetBank = new Bank(beets);

  $('.bass-play').click(function () {
    $('.bass-pad').removeClass('bass-pad-on');
    $(this).addClass('bass-pad-on');
    bassBank.toggle($(this).attr('id'), function () {
      $('.bass-pad').removeClass('bass-pad-on');
    });
    bassBank.timer($(this).attr('id'), function (count) {
      $('#bass-timer').show();
      $('#bass-timer').html(count);
      $('#bass-timer').fadeOut();
    });
  });

  $('.beet-play').click(function () {
    $('.beet-pad').removeClass('beet-pad-on');
    $(this).addClass('beet-pad-on');
    beetBank.toggle($(this).attr('id'), function () {
      $('.beet-pad').removeClass('beet-pad-on');
    });
    beetBank.timer($(this).attr('id'), function (count) {
      $('#beet-timer').show();
      $('#beet-timer').html(count);
      $('#beet-timer').fadeOut();
    });
  });
  //beetBank.pads['beet9'].source.play();
}());
