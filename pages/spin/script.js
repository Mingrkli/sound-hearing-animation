const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileupload');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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
    analyser.fftSize = 2048; // Audio sample or more bars
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

let spin = 0;
function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] *  2.5; // bar Height

        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2); // Center
        ctx.rotate(i * 4.184);
        ctx.rotate(spin);

        // Colors
        const hue = barHeight * 2;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

        ctx.beginPath();
        ctx.arc(0, barHeight/2, barHeight/2, 0, Math.PI / 4);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();

        x += barWidth;
        spin += 1;
    }
}