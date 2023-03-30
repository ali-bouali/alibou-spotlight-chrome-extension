const apiKey = 'YOUTUBE_API_KEY';
const channelId = 'CHANNEL_ID';
const maxResults = 5;
const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`;

function displayVideos(data) {
  const videoList = document.getElementById('videoList');
  data.items.forEach((item) => {
    const videoContainer = document.createElement('div');
    const li = document.createElement('li');
    const a = document.createElement('a');
    const img = document.createElement('img');
    const separator = document.createElement('hr');
    a.href = `https://www.youtube.com/watch?v=${item.id.videoId}`;
    a.target = '_blank';
    a.textContent = item.snippet.title;
    
    img.src = `${item.snippet.thumbnails.medium.url}`;

    videoContainer.classList.add('video-item');

    videoContainer.appendChild(img);
    videoContainer.appendChild(a);

    li.appendChild(videoContainer);
    li.appendChild(separator);

    videoList.appendChild(li);
  });
}

function fetchVideos() {
  showLoader();
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayVideos(data);
      hideLoader();
    })
    .catch((error) => {
      hideLoader();
      const videoList = document.getElementById('videoList');
      const li = document.createElement('li');
      const h4 = document.createElement('h3');
      h4.textContent = 'You have reached the daily fetching quota!';
      li.appendChild(h4);
      li.style = "text-align: center";
      videoList.appendChild(li);

    });
}

function showLoader() {
  document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

fetchVideos();
