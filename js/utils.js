const backend = "https://youtube-backend-uz.herokuapp.com";
async function request(route, method, body){
	try{
		let headers = {
			token: window.localStorage.getItem('token')
		}
		if (!(body instanceof FormData) && method != 'GET') {
			headers['Content-Type'] = 'application/json'
			body = JSON.stringify(body || null)
		}
	
		let response = await fetch(backend + route, {
			method: method,
			headers,
			body
		})
	
		if(response.status == 401){
			return await response.json()
		}
	
		if (![200, 201].includes(response.status)) {
			response = await response.json()
	
			return response
		}
	
		return await response.json()
	}catch(err){
		console.log(err)
	}
}

function createElements(...elements) {
    return elements.map(el => document.createElement(el))
}