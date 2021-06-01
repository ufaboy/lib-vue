module.exports = {
  pwa: {
    name: 'Library',
    themeColor: '#4285f4',
    msTileColor: '#000000',
    workboxPluginMode: 'GenerateSW',

    // настройки манифеста
    manifestOptions: {
      icons: [
        {
          'src': './img/icons/maskable_icon_x72.png',
          'sizes': '72x72',
          'type': 'image/png',
          'purpose': 'any maskable'
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
          'purpose': 'any maskable'
        },
        {
          'src': './img/icons/maskable_icon_x384.png',
          'sizes': '384x384',
          'type': 'image/png',
          'purpose': 'any maskable'
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