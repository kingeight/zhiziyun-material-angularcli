// 百度地图加载器

const url = 'http://api.map.baidu.com/api?v=2.0&ak=mxf9p8x8dtXF7NDDTUe75DdL&callback=__onBaiduMapsLoaded';

export class BaiduMapLoader {
    private static promise;

    public static load() {

        // First time 'load' is called?
        if (!BaiduMapLoader.promise) {

            // Make promise to load
            BaiduMapLoader.promise = new Promise((resolve) => {

                // Set callback for when google maps is loaded.
                window['__onBaiduMapsLoaded'] = (ev) => {
                    console.log('baiduMap loaded');
                    resolve(window['BMap']);
                };
                const node = document.createElement('script');
                node.src = url;
                node.type = 'text/javascript';
                document.getElementsByTagName('head')[0].appendChild(node);
            });
        }
        return BaiduMapLoader.promise;
    }
}

