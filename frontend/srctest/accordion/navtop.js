/**
 * 顶部导航
 * 
 */

angular.module('navtopMoudle',[]).controller('NavtopCtrl', 
	['$scope','feedbacklData','scheduleData',
	
	function ($scope,feedbacklData,scheduleData) {
		$scope.content = "";
		$scope.myaside = false;
		$scope.send = function(value){
			feedbacklData.addData(value).then(function(data){
				$scope.changeAlert(data.msg);
			})
		}

		$scope.changeAlert = function(title,content){
	        $alert({title: title, content: content, type: "info", show: true,duration:3});
	    }

	    scheduleData.getData().then(function(data){
	    	$scope.messages = data.schedules
	    })

	    $scope.readedMsg = function(value){
	    	
	    	value.forEach(function(val,index){
	    		scheduleData.deleteData(val)
	    		
	    	})
	    }

	    setInterval(function(){
	    	scheduleData.getData().then(function(data){
		    	$scope.messages = data.schedules
		    })
		    console.log('请求一次服务器')
	    },60000)
	}
]);