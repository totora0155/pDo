chrome.app.runtime.onLaunched.addListener ->
  chrome.app.window.create 'a.html',
    id: 'pDoWIndow'
    bounds:
      height: 480
      width: 340
    minHeight: 480
    minWidth: 340
  , ->
    chrome.storage.local.get ['taskAO'], (res) ->
      if Object.keys(res).length > 0
        setO = taskAO: []
        for task in res.taskAO when not task.didB
          setO.taskAO.push task if not task.didB
          task.anime.addB = false
        chrome.storage.local.set setO, ->

chrome.runtime.onInstalled.addListener () ->
  chrome.storage.local.get ['taskAO'], (res) ->
    if Object.keys(res).length < 1
      setO = taskAO: []
      chrome.storage.local.set setO, ->
