(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var doc, nowN, pdo, taskareaHE;

doc = document;

nowN = (new Date()).getTime();

taskareaHE = doc.getElementById('js-input');

taskareaHE.focus();

pdo = angular.module('pdo', []);

pdo.directive('zeroTask', function(msgFactory) {
  return function(scope, el, attr) {
    return el[0].innerHTML = attr.zeroTask;
  };
}).factory('msgFactory', function() {
  return {
    zeroTask: chrome.i18n.getMessage('zeroTask'),
    today: chrome.i18n.getMessage('today'),
    yesterday: chrome.i18n.getMessage('yesterday'),

    /**
     * 何日前なのか値を代入して返す
     * @param  {Number} day 何日前の数値
     * @return {String}     １日前のような文字列
     */
    daysAgo: function(day) {
      return chrome.i18n.getMessage('daysAgo', '' + day);
    }
  };
}).factory('taskFactory', function($q) {
  return {

    /**
     * 保存済みのタスクを非同期で取得する
     */
    getTasks: function() {
      var deferred;
      deferred = $q.defer();
      chrome.storage.local.get(['taskAO'], function(res) {
        return deferred.resolve(res);
      });
      return deferred.promise;
    },

    /**
     * タスクを追加したオブジェクト配列を保存する
     */
    setTasks: function(setO) {
      return chrome.storage.local.set(setO, function() {});
    }
  };
}).factory('calcFactory', function() {
  return {

    /**
     * 全体のうちどれだけのタスクを完了したのかパーセントを計算する
     * @param  {Array} taskAO すべてのタスクが入ったオブジェクト配列
     * @return {Number}       パーセントの数値
     */
    perDid: function(taskAO) {
      var allSizeN, countN, task, _i, _len;
      allSizeN = taskAO.length;
      countN = 0;
      for (_i = 0, _len = taskAO.length; _i < _len; _i++) {
        task = taskAO[_i];
        if (task.didB) {
          countN++;
        }
      }
      return (countN / allSizeN) * 100;
    }
  };
}).controller('PdoCtrl', function($scope, taskFactory, calcFactory, msgFactory) {
  $scope.msg = msgFactory;
  $scope.taskAO = null;
  taskFactory.getTasks().then(function(res) {
    return $scope.taskAO = res.taskAO;
  });
  $scope.perDidN = null;
  $scope.$on('calculate per', function() {
    return $scope.perDidN = calcFactory.perDid($scope.taskAO);
  });
  $scope.$on('add task', function(e, taskO) {
    return $scope.taskAO.push(taskO);
  });

  /**
   * 何日前に記述したタスクなのかを返す
   * @param  {Number} dateN そのタスクの投稿時間
   * @return {String}       今日、昨日、*日前 という文字列
   */
  $scope.calcTurnDate = function(dateN) {
    var diffDateN, turnDateN;
    diffDateN = nowN - dateN;
    turnDateN = ~~(diffDateN / (60 * 60 * 24 * 1000));
    switch (turnDateN) {
      case 0:
        return msgFactory.today;
      case 1:
        return msgFactory.yesterday;
      default:
        return msgFactory.daysAgo(turnDateN);
    }
  };

  /**
   * タスクを完了させる
   * @param  {Object} taskO そのタスクそのもの
   */
  return $scope.onToggle = function(taskO) {
    var setO;
    if (taskO.anime.addB) {
      taskO.anime.addB = false;
    }
    taskO.didB = !taskO.didB;
    $scope.perDidN = calcFactory.perDid($scope.taskAO);
    if (!taskO.didB) {
      taskO.anime.cancelB = true;
    } else {
      taskO.anime.cancelB = false;
    }
    setO = {
      taskAO: $scope.taskAO
    };
    return taskFactory.setTasks(setO);
  };
}).controller('AddCtrl', function($scope, $rootScope, taskFactory) {

  /**
   * 新規タスクの追加
   * @param {Object} e Keydownイベントオブジェクト
   */
  return $scope.addTask = function(e) {
    var createTaskO, isEnterkeyB;
    isEnterkeyB = e.keyCode === 13;
    if (isEnterkeyB && taskareaHE.value !== '') {
      createTaskO = {
        contentS: taskareaHE.value,
        didB: false,
        anime: {
          addB: true,
          cancelB: false
        },
        createdO: (new Date()).getTime()
      };
      taskFactory.getTasks().then(function(res) {
        $rootScope.$broadcast('add task', createTaskO);
        res.taskAO.push(createTaskO);
        return taskFactory.setTasks(res);
      });
      $rootScope.$broadcast('calculate per');
      return taskareaHE.value = '';
    }
  };
});

doc.addEventListener('click', function(e) {
  return taskareaHE.focus();
});



},{}]},{},[1]);