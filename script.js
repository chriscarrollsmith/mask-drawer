// script.js

// Function to load the image from the given path and call the drawImage function
function loadImage() {
  const canvas = document.getElementById("imageCanvas");
  const context = canvas.getContext("2d");

  const image = new Image();
  image.src = "dog.png";

  image.onload = function() {
    // Get the aspect ratio of the image
    const imageAspectRatio = image.width / image.height;

    // Get the viewport dimensions
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    // Calculate the canvas dimensions to fit the image within the viewport while maintaining the image aspect ratio
    if (viewportWidth < viewportHeight * imageAspectRatio) {
      // The viewport is taller than the image, so set the canvas height based on the width
      canvas.width = viewportWidth;
      canvas.height = viewportWidth / imageAspectRatio;
    } else {
      // The viewport is wider than the image, so set the canvas width based on the height
      canvas.width = viewportHeight * imageAspectRatio;
      canvas.height = viewportHeight;
    }

    // Draw the image on the canvas
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
}

// Call the loadImage function on resize of the browser window
window.addEventListener('resize', loadImage);

// Function to draw the loaded image on the canvas
function drawImage(context, image) {
  context.drawImage(image, 0, 0);
}

// Function to capture mouse events on the canvas and call the drawCircle function
function captureMouseEvents() {
  const canvas = document.getElementById("imageCanvas");
  const context = canvas.getContext("2d");
  
  canvas.addEventListener("mousedown", function(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    
    drawCircle(context, x, y);
  });
}

// Function to draw a filled circle on the canvas based on the mouse position
function drawCircle(context, x, y) {
  context.beginPath();
  context.arc(x, y, 50, 0, 2 * Math.PI);
  context.fillStyle = "red";  // Fill color
  context.fill();  // Fill the circle
  context.strokeStyle = "red";
  context.lineWidth = 3;
  context.stroke();
}

// Function to save the circled region as a PNG image mask
function saveMaskImage() {
  const canvas = document.getElementById("imageCanvas");
  const context = canvas.getContext("2d");
  
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  const maskContext = maskCanvas.getContext("2d");
  
  maskContext.fillStyle = "rgba(0, 0, 0, 0)";
  maskContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
  
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    
    if (r === 255 && g === 0 && b === 0) {
      pixels[i + 3] = 0;
    } else {
      pixels[i + 3] = 255;
    }
  }
  
  maskContext.putImageData(imageData, 0, 0);
  
  const maskImage = maskCanvas.toDataURL("image/png");
  
  const link = document.createElement("a");
  link.href = maskImage;
  link.download = "mask.png";
  link.click();
}

// Call saveMaskImage on click of the 'Save Mask' button
document.getElementById("saveMaskButton").addEventListener("click", saveMaskImage);

// Call the functions to load the image and capture mouse events
loadImage();
captureMouseEvents();