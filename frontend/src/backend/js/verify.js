var submit = document.getElementById("f-submit")
submit.disabled = true

function getResponse(resp){
    console.log(resp);
    document.getElementById("f-submit").disabled = false
}


$(document).ready(function() {
	// 使用 jQuery 异步提交表单
	
	$('#f-signup').submit(function() {
		jQuery.ajax({
			url: '/user/signup',
			data: $('#f-signup').serialize(),
			type: "POST",
			beforeSend: function() {  

			},
			success: function(data) {
				if(data.status == 1){
					$('#f-alert').html(data.msg).slideDown(300)
					setTimeout(function(){
						window.location.href = "/verify"
					},1000)
				}else{
					$('#f-alert').html(data.msg).slideDown(300)
					setTimeout(function(){
						$('#f-alert').slideUp(300)
					},3000)
				}
			}
		});
		return false;
	});
	$('#f-signin').submit(function() {
		jQuery.ajax({
			url: '/user/signin',
			data: $('#f-signin').serialize(),
			type: "POST",
			beforeSend: function() {  

			},
			success: function(data) {
				if(data.status == 1){
					$('#f-alert').html(data.msg).slideDown(300)
					setTimeout(function(){
						window.location.href = "/#/index"
					},1000)
				}else if(data.status == 2){
					$('#f-alert').html(data.msg).slideDown(300)
					setTimeout(function(){
						window.location.href = "/verify"
						
					},2000)
				}else{
					$('#f-alert').html(data.msg).slideDown(300)
					setTimeout(function(){
						$('#f-alert').slideUp(300)
					},3000)
				}
			}
		});
		return false;
	});
	
});