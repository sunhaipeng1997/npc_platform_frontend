
// import {ServerUrl,UploadNewsImage} from '@/assets/http/apiUrl';
//main.js里全局引入mockjs会导致导出excel模块 接收的服务端blob数据乱码,所以只在这里用。
import '@/assets/mock'

// const ServerUrl = "https://www.yarenda.cn";
const ServerUrl = "http://192.168.1.46:8082";

/*
 * @author 李亚林
 * 参照了官方的自定义上传组件，但是官方代码有不太容易发现的bug
 * 做了一定的改动
 */
class MyUploadAdapter {

    constructor( loader ) {
        // The file loader instance to use during the upload.
        // 要在上载期间使用的文件加载器实例
        this.loader = loader;
    }

    // 启动上传过程
    // Starts the upload process.
    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                this._initRequest();
                this._initListeners( resolve, reject, file );
                this._sendRequest( file );
            } ) );
    }

    // 中止上传过程
    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }


    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    // 使用传递给构造函数的URL初始化XMLHttpRequest对象.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        // Note that your request may look different. It is up to you and your editor
        // integration to choose the right communication channel. This example uses
        // a POST request with JSON as a data structure but your configuration
        // could be different.
        // 'http://192.168.1.91:8080/api/manager/news/upload_image'
        // xhr.open( 'POST', ''+UploadNewsImage, true );
        xhr.open( 'POST', ServerUrl+'/api/manager/news/upload_image', true );

        // 如果不指定返回响应类型，默认是DOMString
        xhr.responseType = 'json';
    }

    // Initializes XMLHttpRequest listeners.
    // 初始化 XMLHttpRequest 监听.
    _initListeners( resolve, reject, file ) {
        const xhr = this.xhr;
        const loader = this.loader;
        // const genericErrorText = `Couldn't upload file: ${ file.name }.`;
        const genericErrorText = `无法上传文件: ${ file.name }.`;


        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            // const response = xhr.response;

            //这里要先解析一下，否则response并非JSON对象，而是一个字符串，获取其中任何字段始终提示未定义；
            // MD，前后端折腾了这么久，响应类型、后端接口改来改去，才发现这个问题，
            // 官方的就是上面这一句const response = xhr.response;
            const response = JSON.parse(xhr.response);
            console.log("response:");
            console.log(response);
            // This example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            // 当上传失败时，必须调用reject()函数。
            if ( !response || response.status!=='OK' ) {
                return reject( response && response.message ? response.message : genericErrorText );
            }



            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            // This URL will be used to display the image in the content. Learn more in the
            // UploadAdapter#upload documentation.
            console.log(ServerUrl);
            resolve( {
                default:ServerUrl + response.data.url
            } );
        } );

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        // 支持时上传进度。文件加载器有#uploadTotal和#upload属性，用于在编辑器用户界面中显示上载进度栏。
        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }


    // Prepares the data and sends the request.
    // 准备数据并发送请求
    _sendRequest( file ) {
        // Prepare the form data.
        //通过FormData构造函数创建一个空对象
        const data = new FormData();
        //通过append()方法在末尾追加key为files值为file的数据，需要传更多参数就在下方继续append

        data.append( 'image', file );
        // data.append();//指定图片的压缩率

        // Important note: This is the right place to implement security mechanisms
        // like authentication and CSRF protection. For instance, you can use
        // XMLHttpRequest.setRequestHeader() to set the request headers containing
        // the CSRF token generated earlier by your application.
        /**
         * 重要提示:这是实现诸如身份验证和CSRF保护等安全机制的正确位置。
         * 例如，可以使用XMLHttpRequest.setRequestHeader()设置包含应用程序先前生成的CSRF令牌的请求头。
         */

        // Send the request.
        this.xhr.send( data );
    }



}

function MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        // 在这里将URL配置为后端上载脚本
        return new MyUploadAdapter( loader );
    };
}

export {
    MyUploadAdapter,
    MyCustomUploadAdapterPlugin
}
