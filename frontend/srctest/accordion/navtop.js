/**
 * 顶部导航
 * 
 */

angular.module('navtopMoudle',[]).controller('NavtopCtrl', 
	['$scope','feedbacklData',
	
	function ($scope,feedbacklData) {
		$scope.content = "";
		$scope.send = function(value){
			feedbacklData.addData(value).then(function(data){
				$scope.changeAlert(data.msg);
			})
		}

	$scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }
}]);