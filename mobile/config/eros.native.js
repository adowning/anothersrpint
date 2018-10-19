module.exports = {
    appName: 'erosproj',
    appBoard: '/config/index.js',
    // android 监听全局事件homeBack 如果为true 安卓端需要自行调用router.finish方法来关闭应用
    androidIsListenHomeBack: 'true',
    customBundleUpdate: 'false',
    version: {
        android: '1.0.0',
        iOS: '1.0.0'
    },
    page: {
        homePage: '/pages/hello.js',
        aPage: '/pages/event/a.js',
        bPage: '/pages/event/b.js',
        mediatorPage: '/mediator/index.js',
        navBarColor: '#1DA1F2',
        navItemColor: '#ffffff'
    },
    url: {
        image: 'https://lev-inf.benmu-health.com/test/xxx',
        bundleUpdate: 'http://localhosts:3001/app/check'
    },
    zipFolder: {
        iOS: '/ios/WeexEros/WeexEros',
        android: '/android/WeexFrameworkWrapper/app/src/main/assets'
    },
    getui: {
        enabled: 'false',
        appId: '',
        appKey: '',
        appSecret: ''
    },
    tabBar: {
        color: '#777777',
        selectedColor: '#00b4cb',
        backgroundColor: '#fafafa',
        borderColor: '#dfe1eb',
        list: [
            {
                pagePath: '',
                text: '',
                icon: '',
                selectedIcon: '',
                navShow: 'false',
                navTitle: ''
            },
            {
                pagePath: '',
                text: '',
                icon: '',
                selectedIcon: '',
                navShow: '',
                navTitle: ''
            },
            {
                pagePath: '',
                text: '',
                icon: '',
                selectedIcon: '',
                navShow: 'false',
                navTitle: ''
            }
        ]
    }
}
