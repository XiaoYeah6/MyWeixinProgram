// components/lyric/lyric.js
let lyricHigth = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow:{
      type: Boolean,
      value: false
    },
    lyric: String,
  },

  observers:{
    lyric(lrc){
      if(lrc == '暂无歌词'){
        this.setData({
          lrcList: [
            {
              lrc,
              time: 0,
            }
          ],
          nowLrcIndex: -1
        })
      }else{
        this._parseLyric(lrc)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLrcIndex: 0,
    scrollTop: 0,
  },

  lifetimes:{
    ready(){
      //750rpx
      wx.getSystemInfo({
        success(res) {
          lyricHigth = res.screenWidth / 750 * 64
        },
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime){
      let lrcList = this.data.lrcList
      if(lrcList.length == 0){
        return
      }
      if(currentTime > lrcList[lrcList.length - 1].time){
        if(this.data.nowLrcIndex != -1){
          this.setData({
            nowLrcIndex: -1,
            scrollTop: lrcList.length * lyricHigth
          })
        }
      }
      for(let i = 0,len = lrcList.length; i < len; i++){
        if(currentTime <= lrcList[i].time){
          this.setData({
            nowLrcIndex: i-1,
            scrollTop: (i-1) * lyricHigth
          })
          break
        }
      }
    },
    _parseLyric(sLyric){
      let _lrcList = []
      let line = sLyric.split('\n')
      line.forEach((elem)=>{
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time != null){
          let lrc = elem.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3] / 1000)
          _lrcList.push({
            lrc,
            time: time2Seconds
          })
        }
      })
      this.setData({
        lrcList: _lrcList
      })
    }
  }
})
