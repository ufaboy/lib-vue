module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/library-example/' : '/',
  css: {
    loaderOptions: {
      css: {
      },
      // scss : {
      //   additionalData: `@import "@/assets/variables.scss";`
      // }
    }
  },
  pwa: {
    name: 'Library',
    // themeColor: '#080C2A',
    // background_color: "#004e92",

    workboxPluginMode: 'GenerateSW',
    workboxOptions: {},

    // настройки манифеста
    manifestOptions: {
      name: 'My Library',
      display: 'standalone',
      "theme_color": "#3367D6",
      background_color: "#004e92",
      short_name: 'Library',
      description: 'My library for some text',
      icons: [
        {
          'src': './img/icons/maskable_icon_x48.png',
          'sizes': '48x48',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': './img/icons/maskable_icon_x96.png',
          'sizes': '96x96',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': './img/icons/maskable_icon_x72.png',
          'sizes': '72x72',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': './img/icons/maskable_icon_x128.png',
          'sizes': '128x128',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': './img/icons/maskable_icon_x144.png',
          'sizes': '144x144',
          'type': 'image/png',
          'purpose': 'any maskable'
        },
        {
          'src': './img/icons/maskable_icon_x192.png',
          'sizes': '192x192',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': './img/icons/maskable_icon_x384.png',
          'sizes': '384x384',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': './img/icons/maskable_icon_x512.png',
          'sizes': '512x512',
          'type': 'image/png',
          'purpose': 'any maskable'
        }
      ],
    }
  }
}