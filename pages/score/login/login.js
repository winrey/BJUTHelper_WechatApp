var app = getApp()
Page({
  data: {
    year: ['请选择学年', '2016-2017', '2015-2016', '2014-2015', '2013-2014'],
    yearIndex: 0,
    term: ['请选择学期', '1', '2', '3'],
    termIndex: 0,
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
})
