const vm = new Vue({
  data: {
    lintResultObjList: [],
    lintResultPerfect: "0"
  },
  methods: {
    cancelEvent(evt){
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    },
    handleDroppedFile(evt){
      this.lintResultPerfect = "0";

      const fileList = evt.dataTransfer.files;
      if(!fileList) return;
      const file = fileList[0];
      if(!file) return;

      const reader = new FileReader();
      reader.addEventListener('load', this.fetchLintResult, false);
      reader.readAsText(file);
      this.cancelEvent(evt);
    },
    fetchLintResult(evt){
      this.lintResultObjList = lintMusicXml(evt);
      if(this.lintResultObjList.length === 0){
        this.lintResultPerfect = "1";
      }
    }
  }
}).$mount("#lintMusicxmlApp");