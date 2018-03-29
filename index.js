$(function() {
	var Grid = function(width, height) {

	}
});


var input = ''
var artistsarray = []
var resultsarray = []
var results = document.querySelector('.results')
document.querySelector('#search').addEventListener('click', function search(e) {
	e.preventDefault()
	input = document.querySelector('input').value
	console.log(input)
	results = document.querySelector('.results')
	while (results.hasChildNodes()) { // when search is clicked, clear the screen
		results.removeChild(results.lastChild)
	}
	results.innerHTML = `Now Searching for ${input}...`
	fetch(`https://api.soundcloud.com/users/?client_id=f665fc4657f6&q=${input}`) // fetching artists from the input
		.then(function(response) {
			results.innerHTML = ''
			return response.json()
		})
		.then(function artistsearch(jsonstuff) { // creates html elements displaying the artists
			console.log(jsonstuff)
			// console.log(jsonstuff)
			for (var k = 0; k < jsonstuff.length; k++) {
				var artistwrapper = document.createElement('div')
				artistwrapper.className = 'artistwrapper'
				var artistimage = document.createElement('img')
				artistimage.src = jsonstuff[k].avatar_url
				artistimage.id = 'clickimg'
				artistwrapper.appendChild(artistimage)
				var artistname = document.createElement('h2')
				artistname.innerHTML = jsonstuff[k].username
				artistwrapper.appendChild(artistname)
				var artistid = document.createElement('div')
				artistid.id = jsonstuff[k].id
				artistwrapper.appendChild(artistid)
				results.appendChild(artistwrapper)
			}
			artistsarray = document.querySelectorAll('.artistwrapper')
			for (var y = 0; y < artistsarray.length; y++) {
				artistsarray[y].childNodes[0].addEventListener('click', function() { // when artist is clicked, remove artists
					while (results.hasChildNodes()) {
						results.removeChild(results.lastChild)
					}
					var backbutton = document.createElement('button') // creates back button
					backbutton.id = 'back'
					backbutton.innerHTML = 'Back'
					document.querySelector('.search-form').appendChild(backbutton)
					var artist = this.parentNode.childNodes[2].id // artists ID
					results.innerHTML = `Now Searching for songs...`
					fetch(`https://api.soundcloud.com/users/${artist}/tracks/?client_id=f665fc458615b821cdf1a26b6d1657f6`) // gets songs of artist
						.then(function(response2) {
							results.innerHTML = ''
							return response2.json()
						})
						.then(function(json2) {
							for (var i = 0; i < json2.length; i++) { // creates html elementsfor songs
								var resultwrapper = document.createElement('div')
								resultwrapper.className = 'resultwrapper'
								var songimage = document.createElement('img')
								songimage.src = json2[i].artwork_url
								songimage.id = 'clickimg'
								resultwrapper.appendChild(songimage)
								var songtitle = document.createElement('h2')
								songtitle.innerHTML = json2[i].title
								resultwrapper.appendChild(songtitle)
								var artistname = document.createElement('h3')
								artistname.innerHTML = json2[i].user.username
								resultwrapper.appendChild(artistname)
								var songurl = document.createElement('div')
								songurl.id = json2[i].stream_url
								resultwrapper.appendChild(songurl)
								var results = document.querySelector('.results')
								results.appendChild(resultwrapper)
							}
							resultsarray = document.querySelectorAll('.resultwrapper')
							return json2
						})
						.then(function(json2) {
							for (var j = 0; j < resultsarray.length; j++) {
								resultsarray[j].childNodes[0].addEventListener('click', function() { // when song is clicked, play song in audio tag
									var musiclink = this.parentNode.childNodes[3].id + '/?client_id=f665fc458615b821cdf1a26b6d1657f6'
									var playback = document.querySelector('audio')
									playback.src = musiclink
									playback.autoplay = 'autoplay'
									//* ***************************************DOMSTRING
									//var canvas = document.querySelector('canvas')
									//var ctx = canvas.getContext('2d')
									//	console.log(ctx);

									// here we create our chain
									var audio = document.querySelector('audio')
									audio.crossOrigin = 'anonymous'
									var audioContext = new AudioContext()
									var source = audioContext.createMediaElementSource(audio)
									var analyser = audioContext.createAnalyser()
									source.connect(analyser)
									analyser.connect(audioContext.destination)
									///reference later
									setInterval(function() {
										var freqData = new Uint8Array(analyser.frequencyBinCount)
										var height = 300
										var width = 10
										analyser.getByteFrequencyData(freqData)

										//ctx.clearRect(0, 0, 1000, 300)

										for (var i = 0; i < freqData.length; i++) {
											var magnitude = freqData[i] / 2
											//ctx.fillRect(i * 1.5, height, 1, -magnitude * 2)
										}
									}, 33)
									//* ***************************************
								})
							}
							document.querySelector('#back').addEventListener('click', function() { // when back is clicked, go back to the artist state and delete back button
								while (results.hasChildNodes()) {
									results.removeChild(results.lastChild)
								}
								document.querySelector('.search-form').removeChild(document.querySelector('.search-form').lastChild)
								artistsearch(jsonstuff)
							})
						})
				})
			}
		})
});
