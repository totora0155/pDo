doc = document
nowN = (new Date()).getTime()
taskareaHE = doc.getElementById 'js-input'
taskareaHE.focus()

pdo = angular.module 'pdo', []

pdo
.directive 'zeroTask', (msgFactory) ->
  (scope, el, attr) -> el[0].innerHTML = attr.zeroTask


.factory 'msgFactory', ->
  {
    zeroTask: chrome.i18n.getMessage 'zeroTask'
    today: chrome.i18n.getMessage 'today'
    yesterday: chrome.i18n.getMessage 'yesterday'
    ###*
     * 何日前なのか値を代入して返す
     * @param  {Number} day 何日前の数値
     * @return {String}     １日前のような文字列
    ###
    daysAgo: (day) ->
      chrome.i18n.getMessage 'daysAgo', '' + day
  }

.factory 'taskFactory', ($q) ->
  {
    ###*
     * 保存済みのタスクを非同期で取得する
    ###
    getTasks: ->
      deferred = $q.defer()
      chrome.storage.local.get ['taskAO'], (res) ->deferred.resolve res
      deferred.promise

    ###*
     * タスクを追加したオブジェクト配列を保存する
    ###
    setTasks: (setO) ->
      chrome.storage.local.set setO, ->
  }

.factory 'calcFactory', ->
  {
    ###*
     * 全体のうちどれだけのタスクを完了したのかパーセントを計算する
     * @param  {Array} taskAO すべてのタスクが入ったオブジェクト配列
     * @return {Number}       パーセントの数値
    ###
    perDid: (taskAO) ->
      allSizeN = taskAO.length
      countN = 0
      countN++ for task in taskAO when task.didB
      (countN / allSizeN) * 100
  }

.controller 'PdoCtrl', ($scope, taskFactory, calcFactory, msgFactory) ->
  # $scope.taskAO = [
  #   {
  #     contentS: "adjfkajdf"
  #     didB: false
  #     anime:
  #       addB: false
  #       cancelB: false
  #     createdO: new Date(2014,8,4)
  #   }
  #   {
  #     contentS: "adjfkajdf"
  #     didB: false
  #     anime:
  #       addB: false
  #       cancelB: false
  #     createdO: new Date(2014,8,3)
  #   }
  #   {
  #     contentS: "adjfkajdf"
  #     didB: false
  #     anime:
  #       addB: false
  #       cancelB: false
  #     createdO: new Date(2014,8,2)
  #   }
  #   {
  #     contentS: "akjdkflajkafjdjf"
  #     didB: false
  #     anime:
  #       addB: false
  #       cancelB: false
  #     createdO: new Date(2014,8,1)
  #   }
  # ]
  $scope.msg = msgFactory

  $scope.taskAO = null
  taskFactory.getTasks().then (res) -> $scope.taskAO = res.taskAO

  $scope.perDidN = null
  $scope.$on 'calculate per', ->
    $scope.perDidN = calcFactory.perDid $scope.taskAO

  $scope.$on 'add task', (e, taskO) ->
    $scope.taskAO.push taskO

  ###*
   * 何日前に記述したタスクなのかを返す
   * @param  {Number} dateN そのタスクの投稿時間
   * @return {String}       今日、昨日、*日前 という文字列
  ###
  $scope.calcTurnDate = (dateN) ->
    diffDateN = nowN - dateN
    turnDateN = ~~(diffDateN / (60 * 60 * 24 * 1000))
    switch turnDateN
      when 0 then msgFactory.today
      when 1 then msgFactory.yesterday
      else msgFactory.daysAgo turnDateN

  ###*
   * タスクを完了させる
   * @param  {Object} taskO そのタスクそのもの
  ###
  $scope.onToggle = (taskO) ->
    taskO.anime.addB = false if taskO.anime.addB
    taskO.didB = !taskO.didB
    $scope.perDidN = calcFactory.perDid $scope.taskAO
    if not taskO.didB
    then taskO.anime.cancelB = true
    else taskO.anime.cancelB = false

    setO = taskAO: $scope.taskAO
    taskFactory.setTasks setO

.controller 'AddCtrl', ($scope, $rootScope, taskFactory) ->
  ###*
   * 新規タスクの追加
   * @param {Object} e Keydownイベントオブジェクト
  ###
  $scope.addTask = (e) ->
    isEnterkeyB = e.keyCode is 13
    if isEnterkeyB and taskareaHE.value isnt ''
      createTaskO =
        contentS: taskareaHE.value
        didB: false
        anime:
          addB: true
          cancelB: false
        createdO: (new Date()).getTime()

      taskFactory.getTasks()
      .then (res) ->
        $rootScope.$broadcast 'add task', createTaskO
        # $scope.taskAO.push createTaskO
        res.taskAO.push createTaskO
        taskFactory.setTasks res

      # $scope.perDidN = calcPerDid()
      $rootScope.$broadcast 'calculate per'
      # $scope.perDidN = calcFactory.perDid
      taskareaHE.value = ''

doc.addEventListener 'click', (e) ->
  taskareaHE.focus()
