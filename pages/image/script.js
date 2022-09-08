const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileupload');
const imgFile = document.getElementById('imageUpload');
const ctx = canvas.getContext('2d');
let sprite;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// ctx.shadowOffsetX = 2;
// ctx.shadowOffsetY = 5;
// ctx.shadowBlur = 0;
// ctx.shadowColor = 'white';
let audioSource;
let analyser;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

// Plays music when user choose a file
file.addEventListener('change', () => {
    const audioContext = new window.AudioContext();
    
    const audio1 = document.getElementById('audio1');
    // Changes the audio into a line of text and set it as the audio1 source
    audio1.src = URL.createObjectURL(file.files[0]);
            // .load updates the audio element
    audio1.load();
    audio1.play();

    // audio1 as out source, no need to overthink this
    audioSource = audioContext.createMediaElementSource(audio1);
                    // expose audio time and frequency  
    analyser  = audioContext.createAnalyser();
    audioSource.connect(analyser);
            // Your Speakers or your default
    analyser.connect(audioContext.destination);
    // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048
    analyser.fftSize = 128; // Audio sample or more bars
    // bufferLength is half of fftSize and is the number of bars
    const bufferLength = analyser.frequencyBinCount;
    // convert bufferLength to a format which we need
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 15;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear
        // Copies the current frequency into dataArray
        analyser.getByteFrequencyData(dataArray);
        // Creates 32 sound bars basically
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
})

// converts img files into readable for code
imgFile.addEventListener('change', () => {
    const image1 = URL.createObjectURL(imgFile.files[0]);
    sprite = new Image();
    sprite.src = image1;
})

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] *  1.5; // bar Height

        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2); // Center
        ctx.rotate(i * 2);

        // // Colors
        // const hue = 250 + i * 2;
        // ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

        // ctx.beginPath();
        // ctx.arc(0, barHeight, barHeight/10, 0, Math.PI * 2);
        // ctx.arc(0, barHeight/1.5, barHeight/20, 0, Math.PI * 2);
        // ctx.arc(0, barHeight/2, barHeight/30, 0, Math.PI * 2);
        // ctx.arc(0, barHeight/3, barHeight/40, 0, Math.PI * 2);
        // ctx.fill();

        ctx.drawImage(sprite, 0, barHeight, barHeight/2.5, barHeight/2.5);
        
        x += barWidth;
        ctx.restore();
    }
    let size = dataArray[15] * 1.5 > 100 ? dataArray[15] : 100;
    ctx.drawImage(sprite, canvas.width/2 - size/2, canvas.height/2 - size/2, size, size);
}