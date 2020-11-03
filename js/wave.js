//https://medium.com/swlh/building-a-audio-visualizer-with-javascript-324b8d420e7
// https://github.com/foobar404/Wave.js
//https://foobar404.github.io/Wave.js/#/

//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

let canvas = document.getElementById("audio_visual");

let ctx = canvas.getContext("2d");



document.addEventListener("click", function () {

    let audioElement = document.getElementById("source");
console.log(audioElement);

  // new AudioContext node >> help make other useful audio nodes.
  let audioCtx = new AudioContext();
//   audioCtx.crossOrigin = "anonymous";

  //let audioCtx = (window.AudioContext || window.webkitAudioContext)();

  // Analyser node - IMPORTANT
  //gives the frequency data to make visuals
  let analyser = audioCtx.createAnalyser();

  // fftSize after making it. This tells the analyser how large the array of data should be that it gives back to us. It takes the number you give it a divides it by 2. Also note that you have to give it a value that is a root of 2. Such as 2 ** 11 = 2048. So the array size it gives back is 1024.
  analyser.fftSize = 2048;

  //soruce node - converts audio element into a node
  let source = audioCtx.createMediaElementSource(audioElement);

  //this connects our music back to the default output, such as your //speakers
  source.connect(analyser);

  source.connect(audioCtx.destination);

  // array to store data
  //array needs to be an unsigned array, (no negative numbers), that has a length of your fftSize we set earlier divided by 2.
  let data = new Uint8Array(analyser.frequencyBinCount);

  //equiv to
  // var bufferLength = analyser.frequencyBinCount;
  // var dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(data);
  console.log(data);

  function loopingFunction() {
    requestAnimationFrame(loopingFunction);
    analyser.getByteFrequencyData(data);
    draw(data);
  }

  function draw(data) {
    data = [...data];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let space = canvas.width / data.length;
    data.forEach((value, i) => {
      ctx.beginPath();
      ctx.moveTo(space * i, canvas.height); //x,y
      ctx.lineTo(space * i, canvas.height - value); //x,y
      ctx.stroke();
    });
  }

  audioElement.onplay = () => {
    audioCtx.resume();
  };
});
