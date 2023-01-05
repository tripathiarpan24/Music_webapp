const wrapper = document.querySelector(".wrapper"),
musicImage = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn =wrapper.querySelector(".play-pause"),
prevBtn =wrapper.querySelector("#prev"),
nextBtn =wrapper.querySelector("#next"),
progressArea=wrapper.querySelector(".progress-area"),
progressBar=wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = wrapper.querySelector("#close")
;

let musicIndex = Math.floor((Math.random()*allMusic.length+1));
window.addEventListener("load",()=>{
    loadMusic(musicIndex);
    playingNow();
})

function loadMusic(indexNo){
    musicName.innerText = allMusic[indexNo-1].name;
    musicArtist.innerText = allMusic[indexNo-1].artist;
    musicImage.src = `images/${allMusic[indexNo-1].img}.jpg`;
    mainAudio.src = `music/${allMusic[indexNo-1].src}.mp3`;
}
function playMusic()
{
     wrapper.classList.add("paused");
     playPauseBtn.querySelector("i").innerText="pause";
     mainAudio.play();
     playingNow();
}
function pauseMusic()
{
     wrapper.classList.remove("paused");
     playPauseBtn.querySelector("i").innerText="play_arrow";
     mainAudio.pause();
}
function nextMusic(){
    musicIndex++;
    musicIndex>allMusic.length ? musicIndex=1 :musicIndex= musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
function prevMusic(){
    musicIndex--;
    musicIndex<1 ? musicIndex=allMusic.length :musicIndex= musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}


playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
})

prevBtn.addEventListener("click",()=>{
    prevMusic();
})
nextBtn.addEventListener("click",()=>{
    nextMusic();
})

mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime/duration)*100;
    progressBar.style.width =`${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
mainAudio.addEventListener("loadeddata",()=>{
  
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration/60);
    let totalSec = Math.floor(audioDuration%60);
    if(totalSec<10)
    {
        totalSec = `0${totalSec}`;
    }

    musicDuration.innerText = `${totalMin}:${totalSec}`;
})

   
    let currentMin = Math.floor(currentTime/60);
    let currentSec = Math.floor(currentTime%60);
    if(currentSec<10)
    {
        currentSec = `0${currentSec}`;
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click",(e)=>{
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;
     mainAudio.currentTime = (clickedOffSetX/progressWidthVal)*songDuration;
     
})

const repeatBtn = wrapper.querySelector("#repeat-plist");

repeatBtn.addEventListener("click",()=>
{
    let getText = repeatBtn.innerText;
switch(getText){
    case "repeat":
                  repeatBtn.innerText = "repeat_one";
                  repeatBtn.setAttribute("tittle","song looped");
                  break;
    case "repeat_one":
                  repeatBtn.innerText = "shuffle";
                  repeatBtn.setAttribute("tittle","playback shuffled");
                  break;
    case "shuffle":
                  repeatBtn.innerText = "repeat";
                  repeatBtn.setAttribute("tittle","playlist looped");
                  break;
                  
}
});
mainAudio.addEventListener("ended",()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
                      nextMusic();
                      break;
        case "repeat_one":
                      currentTime = 0;
                      loadMusic(musicIndex);
                      playMusic();
                      playingNow();
                      break;
        case "shuffle":
                      let randIndex = Math.floor((Math.random()*allMusic.length+1));
                      do{
                        randIndex = Math.floor((Math.random()*allMusic.length+1));
                      }
                      while(musicIndex == randIndex);
                      musicIndex = randIndex;
                      loadMusic(musicIndex);
                      playMusic();
                      playingNow();
                      break;
                      
    }
});

showMoreBtn.addEventListener("click",()=>
{
   musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click",()=>
{
     showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
for(let i=0;i<allMusic.length;i++)
{
    let liTag = ` <li li-index="${i+1}">
    <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>  
    </div>
    <audio id="audio${i}" src="music/${allMusic[i].src}.mp3"></audio>
   <span  id="duration${i}" class="audio-duration">3:40</span>
</li>`;
ulTag.insertAdjacentHTML("beforeend", liTag);
let liAudioDurationTag = ulTag.querySelector(`#duration${i}`);
let liAudioTag = ulTag.querySelector(`#audio${i}`);
liAudioTag.addEventListener("loadeddata", ()=>{
    let Duration = liAudioTag.duration;
    let totalMin = Math.floor(Duration/60);
    let totalSec = Math.floor(Duration%60);
    if(totalSec<10)
    {
        totalSec = `0${totalSec}`;
    }

    liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDurationTag.setAttribute("t-duration",`${totalMin}:${totalSec}`);
});
}
const allLitags = ulTag.querySelectorAll("li");
function playingNow(){
    for(let j=0;j<allLitags.length;j++)
{
    let audioTag = allLitags[j].querySelector(".audio-duration") ;
    if(allLitags[j].classList.contains("playing")){
        allLitags[j].classList.remove("playing");
        let audDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = audDuration;
    }
    if(allLitags[j].getAttribute("li-index")==musicIndex)
    {
        allLitags[j].classList.add("playing");
        audioTag.innerText= "Playing...";
    }
    allLitags[j].setAttribute("onclick","clicked(this)");
}

}
function clicked(element)
{
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex ;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}