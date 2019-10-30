const readButton = document.getElementById("read-musicxml");

// xmlファイルを読み込ませる呪文
readButton.addEventListener("change", () => {
  let fileList = readButton.files;
  if(!fileList) return;
  let file = fileList[0];
  if(!file) return;
  let reader = new FileReader();
  reader.addEventListener('load', parseXML, false);
  reader.readAsText(file);
});

// XML解析処理
const parseXML = (e) =>{
  const xml = e.target.result;
  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const measureArray = dom.querySelectorAll("measure");

  //imaginary bar line check
  Array.from(measureArray).forEach((measure) => {
    let totalDuration = 0;
    let checkFlag = false;
    const durationArray = measure.querySelectorAll("duration");
    durationArray.forEach((duration) => {
      const noteDuration = Number(duration.textContent);
      //全音符はimaginary bar line checkから外す
      if(noteDuration === 48){
        checkFlag = true;
      }
      totalDuration += noteDuration;
      if(totalDuration === 24){
        checkFlag = true;
      }
    });
    if(!checkFlag){
      console.log(
`Imaginary Bar Line error!
${measure.closest("part").getAttribute("id")}パート / ${measure.getAttribute("number")}小節`);
    }
  });

  //歌詞入力欠けチェック(ベースパートを除外)
  Array.from(measureArray)
  .filter((measure) => {
    return measure.closest("part").getAttribute("id") !== "P5";
  })
  .forEach((measure) => {
    let checkFlag = true;
    const noteArray = measure.querySelectorAll("note");
    noteArray.forEach((note) => {
      //TODO:現状は、「タイ音符を除外」ができない
      note.querySelector("rest");
      if(note.querySelectorAll("lyric").length === 0 && note.querySelector("rest") == null){
        checkFlag = false;
      }
    });
    if(!checkFlag){
      console.log(
`歌詞入力欠け error!
${measure.closest("part").getAttribute("id")}パート / ${measure.getAttribute("number")}小節`);
    }
  });
}