(function(){
	$('#f-forgot').submit(function() {
		jQuery.ajax({
			url: '/forgotsend',
			data: $('#f-forgot').serialize(),
			type: "POST",
			beforeSend: function() {  

			},
			success: function(data) {
				if(data.status == 0){
					$('#f-alert').html(data.msg).slideDown(300)
					setTimeout(function(){
						$('#f-alert').slideUp(300)
					},3000)
				}else{
						window.location.href = "/successsend"
						
				}
			}
		});
		return false;
	});
})()