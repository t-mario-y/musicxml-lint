const dropMusicxmlArea = document.getElementById("dropMusicxmlArea");
dropMusicxmlArea.addEventListener("dragenter", (evt) => {cancelEvent(evt)});
dropMusicxmlArea.addEventListener("dragover", (evt) => {cancelEvent(evt)});
dropMusicxmlArea.addEventListener("drop", (evt) => {handleDroppedFile(evt)});

// 後続eventキャンセル
const cancelEvent = (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  return false;
};

// drop event
const handleDroppedFile = (evt) => {
  const fileList = evt.dataTransfer.files;
  if(!fileList) return;
  const file = fileList[0];
  if(!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', parseXML, false);
  reader.readAsText(file);
  cancelEvent(evt);
};
