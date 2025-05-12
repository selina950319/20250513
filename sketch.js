let facemesh;
let video;
let predictions = [];
const points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

function setup() {
  createCanvas(640, 480); // 設定畫布大小
  video = createCapture(VIDEO); // 啟用攝影機
  video.size(640, 480); // 設定攝影機大小
  video.hide(); // 隱藏 HTML 的 <video> 元素

  facemesh = ml5.facemesh(video, modelReady); // 初始化 facemesh 模型
  facemesh.on("predict", results => {
    predictions = results; // 儲存模型預測結果
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  // 繪製攝影機畫面
  image(video, 0, 0, width, height);

  // 設定線條樣式
  stroke(255, 0, 0); // 紅色線條
  strokeWeight(5); // 線條粗細為5
  noFill();

  // 如果有預測結果，繪製臉部特徵點的連接線
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
