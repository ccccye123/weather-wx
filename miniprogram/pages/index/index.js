//index.js
const app = getApp()

// 引入腾讯地图SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    future: []
  },
  
  onLoad: function() {
    this.qqmapsdk = new QQMapWX({
      key: 'ESYBZ-26E36-MOXSA-MDBNS-XVEIF-PDBIW'
    })  

    this.getCityAndWeather()
  },

  // 获取位置及天气
  getCityAndWeather() {
    var that = this;
    wx.getLocation({
      success: res => {
        this.location_pin = res.longitude + ',' + res.latitude
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res2 => {
            let city = res2.result.address_component.city
            that.setData({
              location_text: city,
            })

            var nation_code = res2.result.ad_info.nation_code
            var city_code = res2.result.ad_info.city_code
            var nation_index = city_code.indexOf(nation_code)
            if (nation_index == 0) {
              city_code = city_code.substring(nation_code.length)
            
              that.getNowWeather(city_code)
            } else {
              // 没有省级代码
            }

          }
        })
      },
      fail: () => {
        console.log('未授权位置');
      }
    })
  },

  // 获取当前天气
  getNowWeather(adCode) {
    var that = this
    console.log('adcode:'+adCode)

    // 获取实时预告
    wx.request({
      url: 'https://www.ccccye.cn/weather/get.do',
      data: { adcode: adCode},
      complete(res) {
        console.log(res)
        if (res.statusCode == 200 && res.data.code == 200) {

          that.setData({
            city: res.data.data.location,
            temp: res.data.data.realTime.temp,
            weather: res.data.data.realTime.weather,
            today: res.data.data.today,
            wd: res.data.data.realTime.windDir,
            humidity: res.data.data.realTime.humidity,
            // pm25: res.data.data.pm25,

            // air: res.data.data.lifeInfo.zs_kqwr.type,
            proposeCY: res.data.data.lifeStyle.drsg.txt,

            future: res.data.data.forecasts
          })
        }
        else {

        }
      }
    })

  }

})
