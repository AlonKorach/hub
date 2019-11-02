function arrangeFrames() {
  let frames = document.querySelectorAll(".frame");
  for (let i = 0; i < frames.length; i++) {
     frames[i].style.left = -100*i + "%";
  }
  events();
}

function moveFrames(j) {
  let frames = document.querySelectorAll(".frame");
  for (let i = 0; i < frames.length; i++) {
    frames[i].style.left = -100*i + 100*j + j*5+i + "%";
  }
  activeTab(j);
}

function events(){
  let tabs = document.querySelectorAll(".tab");
  for (let i = 0; i < tabs.length; i++) {
    // tabs[i].addEventListener("click", () => {moveFrames(i)})
    tabs[i].onclick = function () { moveFrames(i) };
  }
}

function activeTab(i){
  let tabs = document.querySelectorAll(".tab");

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].className = "tab inactive";
  }
  tabs[i].className = "tab";
}
