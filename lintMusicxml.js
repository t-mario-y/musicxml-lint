/*
 * MusixXMLを解析して結果を返すことに専念する(Viewのロジックを入れない)
 */
// MusicXML校正処理
const lintMusicXml = (e) =>{
  const xml = e.target.result;
  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const measureArray = dom.querySelectorAll("measure");

  const lintResultObjList = [];

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
      const partId = measure.closest("part").getAttribute("id");
      lintResultObjList.push(new lintResultObj(
        'imaginary bar line',
        partId,
        convertPartIdToPartName(dom, partId),
        measure.getAttribute("number")
      ));
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
        //TODO:現状は、「タイ音符をチェック対象から除外」ができない
        note.querySelector("rest");
        if(note.querySelectorAll("lyric").length === 0 && note.querySelector("rest") == null){
          checkFlag = false;
        }
      });
      if(!checkFlag){
        const partId = measure.closest("part").getAttribute("id");
        lintResultObjList.push(new lintResultObj(
          'lyric lack',
          partId,
          convertPartIdToPartName(dom, partId),
          measure.getAttribute("number")
        ));
      }
    });
  return lintResultObjList;
};

class lintResultObj {
  constructor (_violartionKind, _partId, _partName, _measurePlace){
    this.violartionKind = _violartionKind;
    this.partId = _partId;
    this.partName = _partName;
    this.measurePlace = _measurePlace;
  }
}

const convertPartIdToPartName = (dom, partId) =>{
  return dom.querySelector(`score-part#${partId}`).querySelector(`part-name`).textContent;
}