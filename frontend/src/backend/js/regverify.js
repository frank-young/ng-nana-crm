(function(){
	var re = /@{1}\w+/,
		urlele = document.getElementById('f-verify-url'),
		str = urlele.innerHTML,
		stmp = re.exec(str)[0].substring(1);
	switch (stmp) {
		case "qq":
			urlele.href = "https://mail.qq.com"
			break;
		case "gmail":
			urlele.href = "https://mail.google.com/"
			break;
		case "163":
			urlele.href = "http://mail.163.com/"
			break;
		case "126":
			urlele.href = "http://126.com/"
			break;
		case "yahoo":
			urlele.href = "https://mail.yahoo.com/"
			break;
		case "sina":
			urlele.href = "https://mail.sina.com/"
			break;
		case "sohu":
			urlele.href = "http://mail.sohu.com/"
			break;
		case "hotmail":
			urlele.href = "http://mail.hotmail.com/"
			break;
		case "aliyun":
			urlele.href = "https://mail.aliyun.com/"
			break;
		default:
			urlele.href = "#"
			break;
	}

})()

