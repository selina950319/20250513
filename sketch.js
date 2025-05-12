let video;
let facemesh;
let predictions = [];

// 嘴巴線條使用的點
const mouthIndices = [
  409, 270, 269, 267, 0, 37, 39, 40, 185,
  61, 146, 91, 181, 84, 17, 314, 405, 321,
  375, 291, 76, 77, 90, 180, 85, 16, 315,
  404, 320, 307, 306, 408, 304, 303, 302,
  11, 72, 73, 74, 184
];

// 左眼線條使用的點
const leftEyeIndices = [
  243, 190, 56, 28, 27, 29, 30, 247,
  130, 25, 110, 24, 23, 22, 26, 112,
  133, 173, 157, 158, 159, 160, 161,
  246, 33, 7, 163, 144, 145, 153,
  154, 155
];

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("FaceMesh model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // --- 自動對嘴邏輯 ---
    const faceMouth = keypoints[13]; // 臉上嘴巴中心

    const mouthRefIndex = mouthIndices.indexOf(13);
    if (mouthRefIndex === -1) {
      console.warn("點 13 不在 mouthIndices 中");
      return;
    }

    const mouthRefPoint = keypoints[mouthIndices[mouthRefIndex]];
    const dx = faceMouth[0] - mouthRefPoint[0];
    const dy = faceMouth[1] - mouthRefPoint[1];

    // --- 畫紅色嘴巴線條 ---
    stroke(255, 0, 0);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let i = 0; i < mouthIndices.length; i++) {
      const index = mouthIndices[i];
      const [x, y] = keypoints[index];
      vertex(x + dx, y + dy);
    }
    endShape();

    // --- 畫藍色左眼線條 ---
    stroke(0, 0, 255);
    strokeWeight(5);
    noFill();
    beginShape();
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const index = leftEyeIndices[i];
      const [x, y] = keypoints[index];
      vertex(x, y);
    }
    endShape(CLOSE); // 自動閉合線條

    // --- 顯示左眼點位圓點（除錯用）---
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const index = leftEyeIndices[i];
      const [x, y] = keypoints[index];
      fill(0, 0, 255);
      noStroke();
      ellipse(x, y, 5);
    }
  }
}
