form.onsubmit = async event => {
	event.preventDefault();
	username = usernameInput.value.trim()
	password = passwordInput.value.trim()
	file = uploadInput.files[0]

	const formData = new FormData();
	formData.append('username', username);
	formData.append('password', password);
	formData.append('profileImage', file);

	let response = request('/register', 'POST', formData)
	const data = await response
	if(data.status == 400){
		return alert(data.message)
	}else{
		window.localStorage.setItem('token', data.token)
		window.location = './index.html'
	}
}