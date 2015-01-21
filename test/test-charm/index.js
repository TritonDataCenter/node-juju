var charm = {
  ops: "",
  deploy: function(options) {
    console.log(" + Deploy", options)
    this.ops = this.ops + "d";
  },
  expose: function(options) {
    console.log(" + Expose", options)
    this.ops = this.ops + "e";
  },
  addRelation: function(options) {
    console.log(" + Add Relation", options)
    this.ops = this.ops + "ar";
  },
  removeService: function(options) {
    console.log(" + Remove Service", options);
    this.ops = this.ops + "rs";
  }
}
module.exports = charm;
