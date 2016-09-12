/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', 
  ['$scope','$compile', '$timeout', 'uiCalendarConfig','customerData','clueData',
  function($scope, $compile, $timeout, uiCalendarConfig,customerData,clueData) {

	  var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    // $scope.eventSource = []
    // $scope.events = [];

    var obj = clueData.getData().then(function(data){
      var schedule=[];
      var event = {};
      data.clues.forEach( function(ele, i) {
        ele.schedule.forEach( function(element, index) {
            var dateStart = new Date(element.fromDate),
                dStart = dateStart.getDate(),
                mStart = dateStart.getMonth(),
                yStart = dateStart.getFullYear(),

                dateEnd = new Date(element.untilDate),
                dEnd = dateEnd.getDate(),
                mEnd = dateEnd.getMonth(),
                yEnd = dateEnd.getFullYear();

             event.title = element.content;
             event.start = new Date(yStart, mStart, dStart);
             event.end = new Date(yEnd, mEnd, dEnd);
             event.allDay = false;
             schedule.push(event);
          });

      });
      $scope.events = angular.copy(schedule)
      return schedule
    })
    // console.log(obj.$$state)

    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       // events: [
       //    {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
       //    {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
       //    {type:'party',title: 'Click for Google',start: new Date(y, m, 21),end: new Date(y, m, 29),url: 'http://google.com/'}
       //  ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = ('日程内容'+date.title );
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('移动成功 ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('修改时间 ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };

    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalendar = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
                      'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{

        monthYearFormat: 'YYYY MMMM',
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    /* event sources array*/
    // $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

    /* 默认配置 */
    $scope.uiConfig.calendar.dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    $scope.uiConfig.calendar.dayNamesShort = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

    $scope.uiConfig.calendar.monthNames = [ "1月", "2月", "3月", "4月", "5月", "6月","7月","8月","9月","10月","11月","12月"];
    $scope.uiConfig.calendar.monthNamesShort = [ "1月", "2月", "3月", "4月", "5月", "6月","7月","8月","9月","10月","11月","12月"];
}])
