// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSecTime = -1
let touchDuration = 0
let isMoving = false

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00",
    },
    movableDis: 0,
    progress: 0,
  },

  lifetimes: {
    ready() {
      if(this.properties.isSame && this.data.showTime.totalTime == '00:00'){
        this._setTime()
      }
      this._getMovableDis();
      this._bindBGMEvent();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      if (event.detail.source == 'touch') {
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },

    onTouchEnd() {
      let touchedTime = this._timeFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: touchedTime.min + ':' + touchedTime.sec
      })
      backgroundAudioManager.seek(touchDuration * this.data.progress / 100)
      isMoving = false
    },
    _getMovableDis() {
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect();
      query.select('.movable-view').boundingClientRect();
      query.exec((rect) => {
        // console.log(rect)
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
        console.log(movableAreaWidth, movableViewWidth)
      })
    },

    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        console.log('Pause')
        this.triggerEvent('musicPause')
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })

      backgroundAudioManager.onTimeUpdate(() => {
        if(!isMoving){
          // console.log('onTimeUpdate')
          let currentTime = backgroundAudioManager.currentTime
          let duration = backgroundAudioManager.duration
          let currentTimeFMT = this._timeFormat(currentTime)
          let sec = currentTime.toString().split('.')[0]

          if (sec != currentSecTime) {
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: (currentTime / duration) * 100,
              ['showTime.currentTime']: currentTimeFMT.min + ':' + currentTimeFMT.sec
            })
            currentSecTime = sec
            this.triggerEvent('timeUpdate',{
              currentTime
            })
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        console.log("onEnded")
        this.triggerEvent("musicend")
      })

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },

    _setTime() {
      const duration = backgroundAudioManager.duration
      const durationFMT = this._timeFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFMT.min}:${durationFMT.sec}`
      })
      touchDuration = duration
    },

    _timeFormat(duration) {
      const min = Math.floor(duration / 60)
      const sec = Math.floor(duration % 60)
      return {
        min: this._parse0(min),
        sec: this._parse0(sec)
      }
    },

    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})