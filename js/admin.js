let videoList = document.querySelector(".videos-list")


form.onsubmit = async function(e){
	e.preventDefault()

	let caption = videoInput.value.trim()
	let upload = uploadInput.files[0]

	if(caption == "" || upload == undefined){
		return
	}
	if(caption.length < 5){
		alert("Caption must be less than 5 characters")
		return
	}
	if(upload.size > 50 * 1024 * 1024){
		alert("File size must be less than 50MB")
		return
	}

	let formData = new FormData()
	formData.append("caption", caption)
	formData.append("video", upload)

	let response = await request("/video", "POST", formData)

	console.log(response);
	if(response.status == 200){
		console.log(response)
	}
}


async function renderVideos(){
	let videos = await request("/video", "GET")
	let userId = await request("/getId", "GET")
	

    if(renderVideos?.videos?.length == videos?.length) {
		if(JSON.stringify(renderVideos.videos) == JSON.stringify(videos)) {
			return
		}
	}

	renderVideos.videos = videos
    
	videos = videos.filter(video => video.userId == userId.userId)
                    // <li class="video-item">
                    //     <video src="https://www.w3schools.com/html/mov_bbb.mp4" controls=""></video>
                    //     <p class="content" data-id="2" contenteditable="true">dars</p>
                    //     <img src="./img/delete.png" width="25px" alt="upload" class="delete-icon" data-id="2">
                    // </li>
	videoList.innerHTML = null
	for(let i = 0;  i< videos.length; i++){
		let [videoItem, video, caption, deleteIcon] = createElements("li", "video", "p", "img")
		videoItem.classList.add("video-item")
		video.src = videos[i].video
		video.controls = true
		caption.innerText = videos[i].caption
		caption.setAttribute("data-id", videos[i].videoId)
		caption.setAttribute("contenteditable", "true")
		caption.setAttribute("onblur", "updateCaption({videoId: this.dataset.id, caption: this.innerText})")

		caption.classList.add("content")
		deleteIcon.src = "./img/delete.png"
		deleteIcon.setAttribute("data-id", videos[i].videoId)

		deleteIcon.classList.add("delete-icon")
		deleteIcon.setAttribute("onclick", "deleteVideo(this)")
		deleteIcon.setAttribute("width", "25px")
		videoItem.append(video, caption, deleteIcon)
		videoList.append(videoItem)
	}

	updateCaption = async function({videoId, caption}){
		let response = await request(`/video`, "PUT", {videoId, caption})
		if(response){
			alert(`#${videoId} Video updated successfully`)
		}
		if(response.status == 200){
			console.log(response)
		}
	}

	deleteVideo =	async function(id){
		let videoId = id.dataset.id
		let response = await request("/video", "DELETE", {videoId})
		console.log(response)
		if(response){
			alert(`#${videoId} Video deleted successfully`)
		}
	}
}



setInterval(renderVideos, 500)