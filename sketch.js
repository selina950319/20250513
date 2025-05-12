let video;
let facemesh;
let predictions = [];

// 你指定的臉部特徵點索引
const pointIndices = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17,
  314, 405, 321, 375, 291, 76, 77, 90, 180, 85, 16, 315, 404, 320,
  307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 facemesh
  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });

  strokeWeight(5);
  stroke(255, 0, 0); // 紅色線
  noFill();
}

function modelReady() {
  console.log('FaceMesh model ready!');
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 自動對嘴：
    // A. 取得真實嘴巴中心（用點 13 和 14）
    const mouthTop = keypoints[13];
    const mouthBottom = keypoints[14];
    const mouthCenter = [
      (mouthTop[0] + mouthBottom[0]) / 2,
      (mouthTop[1] + mouthBottom[1]) / 2
    ];

    // B. 取得你的自訂圖形的嘴巴參考點（例如第 0 號點）
    const refIndex = 0;
    const refPoint = keypoints[refIndex];

    // C. 計算平移差距（目標嘴巴位置 - 當前嘴巴位置）
    const dx = mouthCenter[0] - refPoint[0];
    const dy = mouthCenter[1] - refPoint[1];

    // D. 畫線，平移整組點
    beginShape();
    for (let i = 0; i < pointIndices.length; i++) {
      const index = pointIndices[i];
      const [x, y] = keypoints[index];
      vertex(x + dx, y + dy); // 平移
    }
    endShape();
  }
}


