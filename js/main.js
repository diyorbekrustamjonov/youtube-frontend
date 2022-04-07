const videoLists = document.querySelector(".iframes-list")
const usersLists = document.querySelector(".navbar-list")
const profileImage = document.querySelector(".avatar-img")
const microphone = document.querySelector("#microphone")

let id;

async function renderUsers(){
	let users = await request("/users", "GET")


    if(renderUsers?.users?.length == users?.length) {
		if(JSON.stringify(renderUsers.users) == JSON.stringify(users)) {
			return
		}
	}


	const voice = new webkitSpeechRecognition()

    voice.lang = 'uz-UZ'
    voice.continious = false
	
    voice.onresult = async event => {
        searchInput.value = event.results[0][0].transcript
		const videos = await request("/video", "GET")
		let searchValue = searchInput.value.toLowerCase()
		let searchVideos = videos.filter(video => video.caption.toLowerCase().includes(searchValue))
		if(searchVideos.length == 0){
			alert("No results")
			return
		}
		return id = searchVideos[0].videoId
    }

    microphone.onclick = () => {
        voice.start()
    }
    voice.onaudioend = () => {
        voice.stop()
    }


	renderUsers.users = users
    
    if(!users){
        return
    }
	usersLists.innerHTML = (`
	<h1>YouTube Members</h1>
	<li class="channel active" id="channel" onclick="userId(this)" data_id="main" data-id="all">
		<a href="#">
			<svg viewbox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; width: 30px; height: 30px;"><g><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8" class="style-scope yt-icon"></path></g></svg>
			<span>Home</span>
		</a>
	</li>
	`)

	for(let i = 0; i < users.length; i++){

		let [li, a, img, span] = createElements("li", "a", "img", "span")

		li.classList.add("channel")
		li.setAttribute("id", "channel")

		li.setAttribute("data-id", users[i].userId)
		li.setAttribute("onclick", "userId(this)")
		a.setAttribute("href", "#")
		img.src = users[i].profileImage
		img.setAttribute("width", "45px")
		img.setAttribute("height", "45px")

		span.textContent = users[i].username
		a.append(img, span)
		li.append(a)
		usersLists.append(li)
	}
}



function userId(userId = null){
	search = undefined
	
	for(let i = 0; i < channel.length; i++){
		channel[i].classList.remove("active")
		userId.classList.add("active")
	}
	if(userId.dataset.id == 'all'){
		id = undefined
	}else{
		id = userId.dataset.id
	}
}


async function renderVideos({userId, videoId}){
    let videos = await request("/video", "GET")
	let users = await request("/users", "GET")

	if(userId) {
		videos = videos.filter(video => video.userId == userId)
	}

	if(videoId){
		videos = videos.filter(video => video.videoId == videoId)
	}

	if(renderVideos?.videos?.length == videos?.length) {
		if(JSON.stringify(renderVideos.videos) == JSON.stringify(videos)) {
			return
		}
	}
	renderVideos.videos = videos

	videoLists.innerHTML = null

	for(let i  = 0; i < videos.length; i++){
		let [iframe, video, iframeFooter, imgChannel, iframeFooterText, channelName, iframeTitle, iframeTime, download, downloadSpan, downloadImg] = createElements("li", "video", "div", "img", "div", "h2", "h3", "time", "a", "span", "img") 
		iframe.classList.add("iframe")
		video.setAttribute("src", videos[i].video)
		video.setAttribute("controls", "")
		iframeFooter.classList.add("iframe-footer")
		imgChannel.src = users.find(user => user.userId == videos[i].userId).profileImage
		iframeFooterText.classList.add("iframe-footer-text")
		channelName.textContent = users.find(user => user.userId == videos[i].userId).username
		channelName.classList.add("channel-name")
		iframeTitle.textContent = videos[i].caption
		iframeTitle.classList.add("iframe-title")
		iframeTime.textContent = videos[i].videoDate
		iframeTime.classList.add("uploaded-time")

		download.classList.add("download")
		download.setAttribute("href", videos[i].video)
		downloadSpan.textContent = videos[i].videoSize + " MB"
		downloadImg.src = "./img/download.png"


		download.append(downloadSpan, downloadImg)
		iframeFooterText.append(channelName, iframeTitle, iframeTime, download)
		iframeFooter.append(imgChannel, iframeFooterText)
		iframe.append(video, iframeFooter)

		videoLists.append(iframe)
	}

}

const renderProfileImage = async () => {
	let me = await request("/getId", "GET")
	if(me.status != 400){
		const users = await request("/users", "GET")
		let user = users.find(user => user.userId == me.userId)
		profileImage.src = user.profileImage
	}

}

renderProfileImage()




let search;


async function renderDataList(){
	datalist.innerHTML = null
	let videos = await request("/video", "GET")
	for(let i = 0; i < videos.length; i++){
		let [option] = createElements("option")
		option.value = videos[i].caption
		option.setAttribute("data-id", videos[i].videoId)
		option.setAttribute("onclick", "videoId({videoId: this.dataset.id})")
		datalist.append(option)
	}

}


form.onsubmit = async function(e){
	const videos = await request("/video", "GET")       
	id = undefined            
	if(searchInput.value == ""){
		search = undefined
		renderVideos({})
		return
	}
	let searchValue = searchInput.value.toLowerCase()
	let searchVideos = videos.filter(video => video.caption.toLowerCase().includes(searchValue))
	if(searchVideos.length == 0){
		search = undefined
	}else{
		renderVideos({videoId: searchVideos[0].videoId})
		search = searchVideos[0].videoId
	}

	console.log(searchVideos)

}


renderDataList()

























setInterval(() => {
	renderVideos({userId: id || null, videoId: search || null})
}, 500)



setInterval(() => {
	renderUsers({})
}, 500)