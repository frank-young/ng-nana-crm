(function(){
	var timer = document.getElementById('f-time')

	setTimeout(function(){
		timer.innerHTML = "2 "
		setTimeout(function(){
			timer.innerHTML = "1 "
			setTimeout(function(){
				timer.innerHTML = "0 "
				window.location.href = "/#/index"
			},1000)
		},1000)
	},1000)
})()

