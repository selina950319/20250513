let facemesh;
let video;
let predictions = [];
const points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

function setup() {
  createCanvas(640, 480); // 設定畫布大小
  video = createCapture(VIDEO);
  video.size(640, 480); // 設定攝影機大小
  video.hide(); // 隱藏 HTML 的 <video> 元素

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  background(220); // 背景顏色
  image(video, 0, 0, width, height); // 將攝影機畫面繪製到畫布上

  stroke(255, 0, 0); // 紅色線條
  strokeWeight(5); // 線條粗細為5
  noFill();

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    beginShape();
    for (let i = 0; i < points.length; i++) {
      const index = points[i];
      const [x, y] = keypoints[index];
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
