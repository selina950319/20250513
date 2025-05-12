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

    // 使用臉上真實嘴巴中心：點 13
    const faceMouth = keypoints[13]; // [x, y]

    // 找出你繪製線條中點 13 的位置（作為對齊基準）
    // 確保你的點列表中也包含 13
    const refIndexInList = pointIndices.indexOf(13);
    if (refIndexInList === -1) {
      console.warn('point 13 not in your custom point list.');
      return;
    }

    const drawRefIndex = pointIndices[refIndexInList];
    const drawRefPoint = keypoints[drawRefIndex]; // [x, y]

    // 計算平移量：讓你的圖形上的點13對準臉上的點13
    const dx = faceMouth[0] - drawRefPoint[0];
    const dy = faceMouth[1] - drawRefPoint[1];

    // 繪製平移後的圖形
    beginShape();
    for (let i = 0; i < pointIndices.length; i++) {
      const index = pointIndices[i];
      const [x, y] = keypoints[index];
      vertex(x + dx, y + dy);
    }
    endShape();
  }
}



