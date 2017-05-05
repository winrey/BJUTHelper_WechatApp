var Zan = require('../../../dist/index');

var app = getApp()
Page(Object.assign({}, Zan.Switch,{
  data: {
    user:"",
    pwd:"",
    year: ['请选择学年', '2016-2017', '2015-2016', '2014-2015', '2013-2014'],
    yearIndex: 0,
    term: ['请选择学期', '1', '2', '3'],
    termIndex: 0,
    rememberMe: {
      checked: false
    },
    showDialog: false,
  },
  onLoad: function () {
    
  },
  onYearChange: function (e) {
    this.setData({
      yearIndex: e.detail.value
    });
  },
  onTermChange: function (e) {
    this.setData({
      termIndex: e.detail.value
    });
  },

  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  
  handleZanSwitchChange(e) {
    var componentId = e.componentId;
    var checked = e.checked;

      // 同步开关
      this.setData({
        [`${componentId}.checked`]: checked
      });

  }
}))
