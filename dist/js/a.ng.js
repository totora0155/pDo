!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(){var doc,nowN,pdo,taskareaHE;doc=document,nowN=(new Date).getTime(),taskareaHE=doc.getElementById("js-input"),taskareaHE.focus(),pdo=angular.module("pdo",[]),pdo.directive("zeroTask",["msgFactory",function(){return function(scope,el,attr){return el[0].innerHTML=attr.zeroTask}}]).factory("msgFactory",function(){return{zeroTask:chrome.i18n.getMessage("zeroTask"),today:chrome.i18n.getMessage("today"),yesterday:chrome.i18n.getMessage("yesterday"),daysAgo:function(day){return chrome.i18n.getMessage("daysAgo",""+day)}}}).factory("taskFactory",["$q",function($q){return{getTasks:function(){var deferred;return deferred=$q.defer(),chrome.storage.local.get(["taskAO"],function(res){return deferred.resolve(res)}),deferred.promise},setTasks:function(setO){return chrome.storage.local.set(setO,function(){})}}}]).factory("calcFactory",function(){return{perDid:function(taskAO){var allSizeN,countN,task,_i,_len;for(allSizeN=taskAO.length,countN=0,_i=0,_len=taskAO.length;_len>_i;_i++)task=taskAO[_i],task.didB&&countN++;return countN/allSizeN*100}}}).controller("PdoCtrl",["$scope","taskFactory","calcFactory","msgFactory",function($scope,taskFactory,calcFactory,msgFactory){return $scope.msg=msgFactory,$scope.taskAO=null,taskFactory.getTasks().then(function(res){return $scope.taskAO=res.taskAO}),$scope.perDidN=null,$scope.$on("calculate per",function(){return $scope.perDidN=calcFactory.perDid($scope.taskAO)}),$scope.$on("add task",function(e,taskO){return $scope.taskAO.push(taskO)}),$scope.calcTurnDate=function(dateN){var diffDateN,turnDateN;switch(diffDateN=nowN-dateN,turnDateN=~~(diffDateN/864e5)){case 0:return msgFactory.today;case 1:return msgFactory.yesterday;default:return msgFactory.daysAgo(turnDateN)}},$scope.onToggle=function(taskO){var setO;return taskO.anime.addB&&(taskO.anime.addB=!1),taskO.didB=!taskO.didB,$scope.perDidN=calcFactory.perDid($scope.taskAO),taskO.anime.cancelB=taskO.didB?!1:!0,setO={taskAO:$scope.taskAO},taskFactory.setTasks(setO)}}]).controller("AddCtrl",["$scope","$rootScope","taskFactory",function($scope,$rootScope,taskFactory){return $scope.addTask=function(e){var createTaskO,isEnterkeyB;return isEnterkeyB=13===e.keyCode,isEnterkeyB&&""!==taskareaHE.value?(createTaskO={contentS:taskareaHE.value,didB:!1,anime:{addB:!0,cancelB:!1},createdO:(new Date).getTime()},taskFactory.getTasks().then(function(res){return $rootScope.$broadcast("add task",createTaskO),res.taskAO.push(createTaskO),taskFactory.setTasks(res)}),$rootScope.$broadcast("calculate per"),taskareaHE.value=""):void 0}}]),doc.addEventListener("click",function(){return taskareaHE.focus()})},{}]},{},[1]);