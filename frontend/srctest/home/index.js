/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', 
  ['$scope','$window','$compile', '$timeout', 'uiCalendarConfig','customerData','clueData','$interval',
  function($scope,$window, $compile, $timeout, uiCalendarConfig,customerData,clueData,$interval) {

	  $window.document.title = "首页-呐呐CRM";
    var createTime = function (value) {
      value = 0 || value;
      var date = new Date(value);
      var weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      this.d = date.getDate();
      this.m = date.getMonth();
      this.y = date.getFullYear();
      this.w = weekArr[date.getDay()];
      this.h = date.getHours()>=10 ? date.getHours() : "0"+date.getHours(); 
      this.mi = date.getMinutes()>=10 ? date.getMinutes() : "0"+date.getMinutes();
      this.s = date.getSeconds()>=10 ? date.getSeconds() : "0"+date.getSeconds();
    }
    createTime.prototype = {
      d:this.d,
      m:this.m,
      y:this.y,
      w:this.w,
      h:this.h,
      mi:this.mi,
      s:this.s
    }

    $scope.events = [];
    $scope.eventSource = [];

    $scope.init = function(){
      /* 客户日历 */ 
      customerData.getData().then(function(data){
        data.customers.forEach( function(ele, i) {
          ele.schedule.forEach( function(element, index) {
              var event = {};
              var dateStart = new createTime(element.fromDate),
                  dStart = dateStart.d,
                  mStart = dateStart.m,
                  yStart = dateStart.y;

              var dateEnd = new createTime(element.untilDate),
                  dEnd = dateEnd.d,
                  mEnd = dateEnd.m,
                  yEnd = dateEnd.y;

               event.title = element.content;
               event.start = new Date(yStart, mStart, dStart);
               event.end = new Date(yEnd, mEnd, dEnd+1);
               event.allDay = true;
               event.color = "#27C24C";
              $scope.eventSource.push(event);
               
            });
        });
      })
      /* 潜在客户日历  */
      clueData.getData().then(function(data){
        data.clues.forEach( function(ele, i) {
          ele.schedule.forEach( function(element, index) {
              var event = {};
              var dateStart = new createTime(element.fromDate),
                  dStart = dateStart.d,
                  mStart = dateStart.m,
                  yStart = dateStart.y;

              var dateEnd = new createTime(element.untilDate),
                  dEnd = dateEnd.d,
                  mEnd = dateEnd.m,
                  yEnd = dateEnd.y;

               event.title = element.content;
               event.start = new Date(yStart, mStart, dStart);
               event.end = new Date(yEnd, mEnd, dEnd+1);
               event.allDay = true;
               $scope.events.push(event);
            });
        });
      })
    }

    $scope.init();
    
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };
    /* alert on eventClick */
    $scope.alertMessage = "请选择日程查看";
    $scope.alertOnEventClick = function( data, jsEvent, view){
        var dateStart = new createTime(data.start),
            dStart = dateStart.d,
            mStart = dateStart.m+1,
            yStart = dateStart.y;

        var dateEnd = new createTime(data.end),
            dEnd = dateEnd.d-1,
            mEnd = dateEnd.m+1,
            yEnd = dateEnd.y;
            console.log(dateEnd)
        if(data.end == null){
          dEnd = "---";
          mEnd = "---";
          yEnd = "---";
        }
        if(data.title == undefined){
          data.title = "暂无内容"
        }
        $scope.alertMessage = '开始日期：'+
            yStart+'-'+mStart+'-'+dStart+
            '<br>结束日期：'+
            yEnd+'-'+mEnd+'-'+dEnd+
            '<br>日程内容：'+data.title;
    };
    /* alert on Drop */
    //  $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
    //    $scope.alertMessage = ('移动成功 : ' + delta);
    // };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('修改时间 : ' + delta);
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
        // monthYearFormat: 'YYYY MMMM',
        editable: false,
        monthNames:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], 
        monthNamesShort:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], 
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        buttonText: { 
            today: '今日',  
            month: '月',  
            week: '周',  
            day: '日'  
        },
        titleFormat:{  
            month: 'YYYY MMMM', //2016 6月  
            day: 'YYYY-MM-d,dddd '  // 2016-06-29,星期三  
        },  
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
    $scope.calendarFunction = function (start, end, timezone, callback) {  
        callback($scope.events);
    }; 
    $scope.calendarFunctionOther = function (start, end, timezone, callback) {  
        callback($scope.eventSource);
    }; 
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.calendarFunction,$scope.calendarFunctionOther];
    
    /* 时间和时区 */
    $scope.timeArr = [
          {
            "value":0,
            "text":'IDL- 国际换日线 (GMT-12)',
          },
          {
            "value":1,
            "text":'MIT - 中途岛标准时间 (GMT-11)',
          },
          {
            "value":2,
            "text":'HST - 夏威夷-阿留申标准时间 (GMT-10)',
          },
          {
            "value":3,
            "text":'AKST - 阿拉斯加标准时间 (GMT-9)',
          },
          {
            "value":4,
            "text":'PSTA - 太平洋标准时间A (GMT-8)',
          },
          {
            "value":5,
            "text":'MST - 北美山区标准时间 (GMT-7)',
          },
          {
            "value":6,
            "text":'CST - 北美中部标准时间 (GMT-6)',
          },
          {
            "value":7,
            "text":'EST - 北美东部标准时间 (GMT-5)',
          },
          {
            "value":8,
            "text":'AST - 大西洋标准时间 (GMT-4)',
          },
          {
            "value":9,
            "text":'SAT - 南美标准时间 (GMT-3)',
          },
          {
            "value":10,
            "text":'BRT - 巴西时间 (GMT-2) ',
          },
          {
            "value":11,
            "text":'CVT - 佛得角标准时间 (GMT-1)',
          },
          {
            "value":12,
            "text":'GMT - 格林威治标准时间 (GMT)',
          },
          {
            "value":13,
            "text":'CET - 欧洲中部时区 (GMT +1)',
          },
          {
            "value":14,
            "text":'EET - 欧洲东部时区 (GMT +2)',
          },
          {
            "value":15,
            "text":'MSK - 莫斯科时区 (GMT +3)',
          },
          {
            "value":16,
            "text":'META - 中东时区A (GMT +4)',
          },
          {
            "value":17,
            "text":'METB - 中东时区B (GMT +5)',
          },
          {
            "value":18,
            "text":'BHT - 孟加拉标准时间  (GMT +6)',
          },
          {
            "value":19,
            "text":'MST - 中南半岛标准时间 (GMT +7)',
          },
          {
            "value":20,
            "text":'EAT - 东亚标准时间/中国标准时间(BJT) (GMT +8)',
          },
          {
            "value":21,
            "text":'FET- 远东标准时间 (GMT +9)',
          },
          {
            "value":22,
            "text":'AEST - 澳大利亚东部标准时间 (GMT +10)',
          },
          {
            "value":23,
            "text":'VTT - 瓦努阿图标准时间 (GMT +11)',
          },
          {
            "value":24,
            "text":'PSTB - 太平洋标准时间B (GMT +12)',
          }
        ]
    $scope.timeInit = function(){
        var dt = new Date(),
          def = dt.getTimezoneOffset()/60,
          timeStamp = dt.getTime(),
          originStamp = timeStamp + dt.getTimezoneOffset()*60*1000-12*60*60*1000;  // GMT 时间
        
          // ti = new createTime(originStamp);
          // console.log(ti.y+'年'+(ti.m+1)+'月'+ti.d+'日 '+ti.w+' '+ti.h+':'+ti.mi+':'+ti.s)
        
        
        $scope.timeShow = [];
        $scope.timeArr.forEach(function(ele,i){
          var ti = new createTime(originStamp);
          ele.date = ti.y+'年'+(ti.m+1)+'月'+ti.d+'日 ';
          ele.week = ti.w;
          ele.time = ti.h+':'+ti.mi+':'+ti.s;
          originStamp += 60*60*1000;
        })
        // return $scope.timeArr
        
    }
    $scope.timeInit();
    $interval(function(){    
      $scope.timeInit()
    },1000)

    var defaultTime = $interval(function(){    
      if(localStorage.selectTimeIndex){
        $scope.selectTimeSure = $scope.timeArr[localStorage.selectTimeIndex]
      }else{
        $scope.selectTimeSure = $scope.timeArr[20]
      }
    },1000)

    $scope.selectTimeSure = $scope.timeArr[20]
    $scope.selectTime = function(value){
      $scope.selectTimeSure = value;
      localStorage.selectTimeIndex = value.value;
      $interval.cancel(defaultTime);
    }
}])



