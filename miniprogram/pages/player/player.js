// pages/player/player.js
let musiclist = []
let nowPlayingIndex = -1
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
const lyric = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isplay: false,
    isLyricShow: false,
    isSame: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._lodeMusicDetail(options.musicId)
  },

  _lodeMusicDetail(musicId) {
    if(musicId == app.getPlayMusicId()){
      this.setData({
        isSame: true
      })
    }else{
      this.setData({
        isSame: false
      })
    }
    if(!this.data.isSame){
      backgroundAudioManager.stop()
    }
    
    this.setData({
      isplay: false
    })
    wx.showLoading({
      title: '歌曲加载中',
    })
    let music = musiclist[nowPlayingIndex]
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })

    this.setData({
      picUrl: music.al.picUrl,
    })

    app.setPlayMusicId(musicId)

    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicUrl',
        musicId: musicId
      }
    }).then((res) => {
      this.setData({
        isplay: true
      })
      console.log(res)
      console.log(JSON.parse(res.result))
      let result = JSON.parse(res.result)
      if(result.data[0].url == null){
        wx.showToast({
          title: '无权限播放',
        })
        return
      }
      if(!this.data.isSame){
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.epname = music.al.name
      }
      
      wx.hideLoading()
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric',
        }
      }).then((res)=>{
        console.log(res)
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if(lrc){
          lyric = lrc.lyric
        }
        this.setData({
          lyric: lyric
        })
      })
    })
  },

  togglePlaying() {
    if (this.data.isplay) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }

    this.setData({
      isplay: !this.data.isplay
    })
  },

  onPrev() {
    nowPlayingIndex--;
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this._lodeMusicDetail(musiclist[nowPlayingIndex].id)
  },

  onNext() {
    nowPlayingIndex++;
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this._lodeMusicDetail(musiclist[nowPlayingIndex].id)
  },

  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  timeUpdate(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },

  onPlay(){
    this.setData({
      isplay: true
    })
  },
  onPause() {
    this.setData({
      isplay: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})