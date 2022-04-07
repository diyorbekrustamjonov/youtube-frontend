
form.onsubmit = async event => {
	event.preventDefault();
	username = usernameInput.value.trim()
	password = passwordInput.value.trim()
	if (username && password) {
		let response = await request('/login', 'POST', {
			username,
			password
		})
		let data = await response

		if (data.status != 200) {
			return alert(data.message)
		}else{
			console.log("asdasd")
			console.log(data)
			window.localStorage.setItem('token', response.token)
			window.location = 'index.html'
		}
	}
}