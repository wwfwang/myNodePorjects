const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const InfoSchema = new Schema({
  type: {
    type: String,
    
  },
  describe: {
    type: String,
    
  },
  income: {
    type: String,
    required:true
    
  },
  expend: {
    type: String,
    required: true
  },
  cash: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});
//这是数据模型
const Info = mongoose.model('Info', InfoSchema);

module.exports = Info 
