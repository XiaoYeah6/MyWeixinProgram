// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },

  observers: {
    ['playlist.playCount'](num){
      this.setData({
        _count: this.transcount(num)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: ['playlist.playCount']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMusiclist(){
      wx.navigateTo({
        url: `../../pages/musicList/musicList?playlistId=${this.properties.playlist.id}`,
      })
    },

    transcount(num){
      var strnum = num.toString().split('.')[0];

      if(strnum.length < 6){
        return strnum;
      } else if (strnum.length >= 6 && strnum.length <= 8){
        var apnum = strnum.slice(strnum.length - 4, strnum.length-2);
        var transnum = parseInt(num/10000) + '.' + apnum + '万';
        return transnum;
      }else if (strnum.length > 8){
        var apnum = strnum.slice(strnum.length - 8, strnum.length - 6);
        var transnum = parseInt(num / 100000000) + '.' + apnum + '亿';
        return transnum;
      }
    }
  }
})
