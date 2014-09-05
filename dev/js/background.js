(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
chrome.app.runtime.onLaunched.addListener(function() {
  return chrome.app.window.create('a.html', {
    id: 'pDoWIndow',
    bounds: {
      height: 480,
      width: 340
    },
    minHeight: 480,
    minWidth: 340
  }, function() {
    return chrome.storage.local.get(['taskAO'], function(res) {
      var setO, task, _i, _len, _ref;
      if (Object.keys(res).length > 0) {
        setO = {
          taskAO: []
        };
        _ref = res.taskAO;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          task = _ref[_i];
          if (!(!task.didB)) {
            continue;
          }
          if (!task.didB) {
            setO.taskAO.push(task);
          }
          task.anime.addB = false;
        }
        return chrome.storage.local.set(setO, function() {});
      }
    });
  });
});

chrome.runtime.onInstalled.addListener(function() {
  return chrome.storage.local.get(['taskAO'], function(res) {
    var setO;
    if (Object.keys(res).length < 1) {
      setO = {
        taskAO: []
      };
      return chrome.storage.local.set(setO, function() {});
    }
  });
});



},{}]},{},[1]);