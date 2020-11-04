document.addEventListener('DOMContentLoaded', function () {


    document.addEventListener('keyup', function (key) {
        if (key.key == ' ') {


    class Draw {
      constructor(opts = {}) {
        this.position = []
        this.ctx = opts.ctx
        this.freq = 0.00015
        this.colors = ['#F5759B', '#D91D25', '#F7AE00', '#01C013', '#008DD4'];
      }

      update() {
      }

      draw(ctx) {
        ctx.save()
        ctx.beginPath()
        for (var i = 1; i < 6; i++) {
          ctx.beginPath()
          for (var x = 0; x < canvas.width; x++) {
            if (moyenne < 10) {
              moyenne = 1
            }
            var y = Math.sin(x * moyenne * (freq * 0.0000025) * (i / 3) + (cumul * 0.0005)) * (moyenne * 2.5)
            ctx.lineTo(x, y + canvas.height / 2)
          }
          ctx.globalAlpha = i / 10
          ctx.strokeStyle = this.colors[i%5]
          ctx.lineWidth = 3
          ctx.stroke()
        }
        ctx.restore()

      }
    }


    var canvas = document.getElementById("audiovis")
    var ctx = canvas.getContext('2d')

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    var audioBuffer
    var audioSource
    var analyser = audioCtx.createAnalyser()
    var biquadFilter = audioCtx.createBiquadFilter()
    var frequencyData
    var frequencyIdx = Math.floor(1024)

    var t = 0
    var DELTA_TIME = 0
    var LAST_TIME = Date.now()

    var moyenne = 0
    var reducer = (acc, reducer) => acc + reducer
    var cumul = 0
    var average = 0
    var lines = []


    var freq = 10

    var songUrl = document.getElementById('audio').src

    canvas.height = parseInt(getComputedStyle(canvas).height)*2
    canvas.width = window.innerWidth
    canvas.style.left = "0px"
    canvas.style.top = "200px";
    canvas.style.position = "absolute";
canvas.style.zIndex = -1



    function loadSound(url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true)
      request.responseType = 'arraybuffer'

      request.onload = function () {
        audioCtx.decodeAudioData(request.response, function (buffer) {
          // success callback
          audioBuffer = buffer
          // Create sound from buffer
          audioSource = audioCtx.createBufferSource()
          audioSource.buffer = audioBuffer
          // connect the audio source to context's output
          audioSource.connect(analyser)
          //analyser.fftSize = 256
          analyser.connect(audioCtx.destination)
          frequencyData = new Uint8Array(analyser.frequencyBinCount)
          // Filters
          audioSource.connect(biquadFilter)
          biquadFilter.connect(audioCtx.destination)
          // play sound
          audioSource.start()
          frame()
        }, function () {
          // error callback
          //
        })
      }
      request.send()
    }

    function initLine() {
      lines = new Draw()
    }

    function frame() {
      requestAnimationFrame(frame)

      DELTA_TIME = Date.now() - LAST_TIME
      LAST_TIME = Date.now()
      t += 0.01

      analyser.getByteFrequencyData(frequencyData)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      biquadFilter.type = "lowshelf"
      biquadFilter.frequency.setValueAtTime(freq, audioCtx.currentTime)
      biquadFilter.gain.value = 25

      moyenne = frequencyData.reduce(reducer) / frequencyData.length

      for (var i = 0; i < 6; i++) {
        // get the frequency according to current i
        let percentIdx = i / 6;
        let frequencyIdx = Math.floor(1024 * percentIdx)

        lines.update()
        lines.draw(ctx)

        cumul += frequencyData[frequencyIdx]
      }
      average = cumul / 255;
    }

    initLine()
    loadSound(songUrl)

}
});
})
