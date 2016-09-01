/********************************************************************************************************************
 *                                                      个人设置
 ********************************************************************************************************************/

angular.module("settingMoudle", []).controller('SettingCtrl', 
	['$scope', '$http', '$state','$alert','settingData',
	function($scope, $http, $state,$alert,settingData) {
	$scope.isEdit = true;
	$scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ];
	settingData.getData().then(function(data){
		$scope.user = data.user
	})
	$scope.saveSetting = function(value){
		settingData.updateData(value)
		// .then(function(data){
  //           $scope.changeAlert('保存成功！');
  //       });
	}
	/*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}])
