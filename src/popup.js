const apiKey = 'YOUTUBE_API_KEY';
const channelId = 'CHANNEL_ID';
const maxResults = 5;
const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&order=date&maxResults=${maxResults}`;


function fetchVideos() {
  showLoader();
  fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const videoIds = data.items.map((item) => item.id.videoId).join(',');
        fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails,statistics`)
            .then((response) => response.json())
            .then((detailsData) => {
              displayVideos(data.items, detailsData.items);
              hideLoader();
            })
            .catch((error) => {
              console.error('Error fetching video details:', error);
              hideLoader();
            });
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
        hideLoader();
      });
}

function formatDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return (hours > 0 ? `${hours}:` : '') + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function formatViews(views) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views;
}

function displayVideos(dataItems, detailsItems) {
  const videoList = document.getElementById('videoList');
  dataItems.forEach((item) => {
    const details = detailsItems.find((detailsItem) => detailsItem.id === item.id.videoId);
    const duration = formatDuration(details.contentDetails.duration);
    const views = formatViews(Number(details.statistics.viewCount));
    const videoContainer = document.createElement('div');
    const metadataContainer = document.createElement('div');
    const li = document.createElement('li');
    const a = document.createElement('a');
    const img = document.createElement('img');
    const separator = document.createElement('hr');
    const videoDuration = document.createElement('span');
    const videoViews = document.createElement('span');
    a.href = `https://www.youtube.com/watch?v=${item.id.videoId}`;
    a.target = '_blank';
    a.innerText = item.snippet.title;

    img.src = `${item.snippet.thumbnails.medium.url}`;

    videoDuration.textContent = 'Video duration: ' + duration;
    videoViews.textContent = views + 'views';
    metadataContainer.appendChild(videoDuration);
    metadataContainer.appendChild(videoViews);
    metadataContainer.classList.add('meta-data');

    videoContainer.classList.add('video-item');

    videoContainer.appendChild(img);
    videoContainer.appendChild(a);

    li.appendChild(videoContainer);
    li.appendChild(metadataContainer);
    li.appendChild(separator);

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
