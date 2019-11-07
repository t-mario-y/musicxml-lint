const vm = new Vue({
  data: {
    lintResultObjList: [],
    lintResultPerfect: false
  },
  methods: {
    cancelEvent(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    },
    handleDroppedFile(evt) {
      this.lintResultPerfect = false;

      const fileList = evt.dataTransfer.files;
      if (!fileList) return;
      const file = fileList[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener("load", this.fetchLintResult, false);
      reader.readAsText(file);
      this.cancelEvent(evt);
    },
    fetchLintResult(evt) {
      const lintResult = lintMusicXml(evt).sort((a, b) => {
        return Number(a.measurePlace) - Number(b.measurePlace);
      });
      if (lintResult.length === 0) {
        this.lintResultPerfect = true;
      }
      this.lintResultObjList = lintResult;
    }
  }
}).$mount("#lintMusicxmlApp");
