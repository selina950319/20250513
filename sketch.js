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
