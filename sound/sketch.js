function setup()
{
    createCanvas(windowWidth, 800);
    //canvas.position(0, 0)
    //canvas.style('z-index', '1')
}

function windowResized()
{
    let b = document.getElementById("canvasContainer");
    resizeCanvas(b.clientWidth, 800, true);
}

function draw()
{
    if (width > 980)
    {
        background("#f8ebd8");
        //circle(width/2,height/2,width/2)
        strokeWeight(6)
        let fscale = 1
        let tscale = 1
        stroke("#de9d7b80")
        drawwave(millis() / 1000 * tscale, height / 5, 0.013 * fscale, 0)
        stroke("#f8ebd890")
        drawwave(millis() / -1900 * tscale, height / 4, 0.017 * fscale, 0)
        stroke("#de9d7b80")
        drawwave(millis() / -700 * tscale, height / 4.5, 0.014 * fscale, 6)
        stroke("#f8ebd890")

        drawwave(millis() / 1200 * tscale, height / 4, 0.012 * fscale, 6)
    }
}

function drawwave(t, amp, frequency, x2)
{
    for (let x = 0; x < width; x += 12)
    {
        let y = 0;
        line(x2 + x, y + 55 + height / 2 + getValue(x, amp, frequency, t), x2 + x, y + -55 + height / 2 + getValue(x + 5521, amp, frequency * 0.9, t));
    }
}

function getValue(x, amp, frequency, t)
{
    return sin(x * frequency + t) * amp * sin(x * frequency * 0.1 + sin(t * 1) + t * 0.5) * sin(x * frequency * 0.1 + t * 0.25);
}

function sin01(x)
{
    return sin(x) * 0.5 + 0.5;
}