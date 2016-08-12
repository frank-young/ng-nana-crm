/********************************************************************************************************************
 *                                                      个人设置
 ********************************************************************************************************************/

angular.module("settingMoudle", []).controller('SettingCtrl', function($scope, $http, $state) {
	$scope.isEdit = true;
	$scope.user = {
		"account":"yangjunaslnd@qq.com",
		"name":"frank",
		"company":"Nana tec",
		"section":"销售部",
		"position":"销售总监",
		"tel":"022-8473645",
		"phone":"18603847263",
		"fax":"022-7539059",
		"sex":"男",
		"birthday":"1993-04-12",
		"city":"天津市北辰区天穆镇政"
	}  
})
