(function(){
	$('#f-forgot').submit(function() {
		jQuery.ajax({
			url: '/forgotsend',
			data: $('#f-forgot').serialize(),
			type: "POST",
			beforeSend: function() {  

			},
			success: function(data) {
				$('#f-alert').html(data.msg).slideDown(300)
				setTimeout(function(){
					$('#f-alert').slideUp(300)
				},3000)
			}
		});
		return false;
	});
})()