$(document).ready(function() {
	$('#f-domain').submit(function() {
		jQuery.ajax({
			url: '/domain/addctrl',
			data: $('#f-domain').serialize(),
			type: "POST",
			beforeSend: function() {  

			},
			success: function(data) {
				if(data.status == 1){
					$('#f-alert').html(data.msg).slideDown(300)
					setTimeout(function(){
						window.location.href = "/#/index"
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
});

