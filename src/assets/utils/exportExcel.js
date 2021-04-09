//导出Excel文件工具模块

export function exportExcel(url, params, that) {
    that.$axios({
        method: 'get',
        url: url,
        params: params,
        responseType: 'blob', //表示响应的内容为二进制对象
        headers: {
            "Authorization": localStorage.getItem("TOKEN"),
        }
    }).then(res => {
        //从响应头中解析出中文文件名，e. Content-Disposition: attachment; filename*=utf-8''%E6%84%8F%E8%A7%81%E4%BF%A1%E6%81%AF.xls
        let encodedFile = res.headers["content-disposition"].split("''")[1];  //经过编码的文件名
        let file = decodeURI(encodedFile);  //解码
        console.log("导出文件名: " + file);

        let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = file; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象

        that.$message({
            type: 'success',
            message: '导出成功!'
        });
    }).catch(err => {
        that.$message({
            type: 'warning',
            message: '导出失败!'
        });
    });
}