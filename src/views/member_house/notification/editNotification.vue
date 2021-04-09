<template>
    <div style="background-color: white">
        <el-page-header @back="goBack" content="编辑/查看通知" style="padding-left: 15px"> </el-page-header>

        <div class="table-demo" >
            <el-row >
                <el-col  :span="5">
                    <div class="block" style="margin-top: 10px" >
                        <el-timeline>
                            <!--:timestamp="item.createTime" hide-timestamp="true"-->
                            <el-timeline-item  placement="top" v-for="(item,index) in opeRecordList" :key="index">
                                <el-card>
                                    <h4>【{{item.action}}】 {{item.operator}}</h4>
                                    <p>操作时间：{{item.createTime}}</p>
                                    <p>结果状态：{{item.originalStatusName}}</p>
                                    <p>反馈信息：{{item.feedback}}</p>
                                </el-card>
                            </el-timeline-item>

                        </el-timeline>
                    </div>
                </el-col>

                
                <el-col :span="12" :offset="1">

                    <el-form  ref="form1"  :disabled="disabled" :model="notificationForm"  label-position="top"  label-width="100px" size="mini">
                        <el-form-item label="通知标题"
                                      prop="title"
                                      :rules="{ required: true, message: '标题不能为空', trigger: 'blur' }">
                            <el-col :span="24" >
                                <el-input v-model="notificationForm.title" placeholder="请输入通知标题" size="mini"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>

                    <!--分割线-->
                    <el-divider content-position="right">通知正文编辑</el-divider>


                    <el-form ref="form3"  :disabled="disabled" :model="notificationForm" >
                        <el-form-item  prop="content">
                            <template>
                                <div class="table">
                                    <!--富文本编辑器-->
                                    <div id="editor">
                                        <ckeditor :editor="editor" @ready="onReady" v-model="notificationForm.content" :config="editorConfig"></ckeditor>
                                    </div>
                                    <!--<editor :content="serverNoticeContent" @on-change="onEditorChange" :server="uploadImgServerApi" ></editor>-->
                                </div>
                            </template>
                        </el-form-item>
                    </el-form>

                    <el-form ref="form4" :disabled="disabled" :model="notificationForm" label-position="top">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="设置接收代表" required>
                                    <!--选择接收人-->
                                    <el-cascader-panel
                                            id="cascader"
                                            :options="npcMemberList"
                                            :props="cascaderProps"
                                            v-model="receivers"
                                            clearable
                                    >

                                    </el-cascader-panel>
                                </el-form-item>
                            </el-col>

                            <el-col :span="11" :offset="1">
                                <el-form-item label="上传通知附件" >
                                    <el-upload
                                            class="upload-demo"
                                            drag
                                            :action="serverUrl +'/api/manager/notification/upload_attachment'"
                                            multiple
                                            show-file-list
                                            :file-list="fileList"
                                            :accept="acceptFileType"
                                            :before-upload="beforeAttachmentUpload"
                                            :on-success="handleUploadSuccess"
                                            :on-remove="handleAttachmentRemove"
                                            style="width: 100%">
                                        <i class="el-icon-upload"></i>
                                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
                                            <div class="el-upload__tip" slot="tip">支持doc, xls, ppt, pdf, docx, xlsx, pptx格式文件，大小不超过50M</div>

                                        </div>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>

                    <!--分割线-->
                    <el-divider content-position="right">操作</el-divider>

                    <el-form ref="form2"  :disabled="disabled" :model="notificationForm" label-position="top" label-width="100px" size="mini">
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="发布与签署" >
                                    <el-row>
                                        <el-col :span="14">
                                            <el-date-picker
                                                    placeholder="选择发布时间"
                                                    v-model="notificationForm.publishAt"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    style="width: 180px;">
                                            </el-date-picker>
                                        </el-col>

                                        <el-col :span="10" style="text-align: right">
                                            <el-input
                                                    placeholder="签署部门"
                                                    v-model="notificationForm.department"
                                                    prefix-icon="el-icon-user"
                                                    style="width: 120px;"  >
                                            </el-input>
                                        </el-col>
                                    </el-row >
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="1">
                                <el-form-item label="操作"   size="mini">
                                    <el-button :disabled="disabled" @click="goBack">取消</el-button>
                                    <el-button :disabled="disabled" type="primary" @click="addOrUpdateNotification('form1')">保存</el-button>
                                    <!--<el-button  @click="toReview">提交审核</el-button>-->
                                </el-form-item>
                            </el-col>
                        </el-row >
                    </el-form>


                </el-col>

            </el-row>

            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import DecoupledDoc from '@ckeditor/ckeditor5-build-decoupled-document';
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn' //中文包
    const upload = require('../../../assets/utils/upload');

    export default {
        name: "editNotification",
        data() {

            return {
                serverUrl:this.API.ServerUrl,

                editor: DecoupledDoc,
                editorData: '<h1>文档型富文本编辑器测试</h1>',
                editorConfig: {
                    // 编辑器的配置
                    language: 'zh-cn',  // 中文
                    extraPlugins: [ upload.MyCustomUploadAdapterPlugin ],
                },

                attachmentUidList:[],
                cascaderProps: { multiple: true },
                receivers: [],//接收代表
                npcMemberList: [],
                fileList:[],
                uploadedfileList:[],
                timestamp:Date(),

                //可取值：add、update、viewDetails
                operation:'add',
                //是否只读
                disabled:false,

                notificationForm:{
                    uid:'',
                    title:'',
                    publishAt:'',
                    department:'',
                    content:'',
                    isBillboard:false,
                    type:3,//一般通知
                    receiversUid:[],
                    attachmentsUid:['',],
                },
                opeRecordList:[{}],

                //上传组件图片窗口上蒙层弹窗
                dialogVisible: false,
                dialogImageUrl: '',

                imageList: [
                    {name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}
                ],

                //上传正文图片的接口
                uploadImgServerApi: this.API.UploadNotificationImage,
                //依次为doc .docx .ppt: .pptx: .xsl: .xslx: .pdf:
                acceptFileType:
                    'application/msword,' +
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
                    'application/vnd.ms-powerpoint,' +
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +
                    'application/vnd.ms-excel,' +
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
                    'application/pdf',

                rules: {
                    title: [
                        {
                            required: true,
                            message: '标题不能为空',
                            trigger: 'blur',
                        },
                    ],
                    publishAt: [
                        {
                            required: true,
                            message: '时间不能为空',
                            trigger: 'blur',
                        },
                    ],
                    content: [
                        {
                            required: true,
                            message: '内容不能为空',
                            trigger: 'blur',
                        },
                    ]
                },
            };
        },
        created(){
            let that = this;
            that.getNpcMemberList();
            that.operation = this.$route.query.operation;
            switch (that.operation) {
                case "add":
                    //初始化一条操作记录
                    that.opeRecordList=[{
                        action: "创建",
                        createTime:Date(),
                        opTime:Date(),
                        feedback:"创建"+that.notificationForm.title,
                        operator: "管理员",
                        resultStatusName: "未保存"
                    }];
                    break;
                case "update" :
                    that.getNotificationDetail(this.$route.query.uid);
                    break;
                case "read" :
                    that.getNotificationDetail(this.$route.query.uid);
                    that.disabled = true;
                    break;
            }
        },

        mounted() {

        },

        methods: {
            /*
            * 页面返回
            */
            goBack() {
                console.log('go back');
                this.$router.push({
                    path:'/member_house/notification'
                });
            },

            onReady( editor )  {
                // 在可编辑区域之前插入工具栏。
                editor.ui.getEditableElement().parentElement.insertBefore(
                    editor.ui.view.toolbar.element,
                    editor.ui.getEditableElement()
                );
            },

            beforeAttachmentUpload(file) {
                console.log("文件类型")
                console.log(file.type)
                    //主要是小程序的API只支持office文档和pdf
                if( file.type ===  'application/msword' ||
                    file.type ===  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                    file.type ===  'application/vnd.ms-powerpoint' ||
                    file.type ===  'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                    file.type ===  'application/vnd.ms-excel' ||
                    file.type ===  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type ===  'application/pdf'){
                    const isLt50M = file.size / 1024 / 1024 < 50;
                    if (!isLt50M) {
                        this.$message.error('附件大小不能超过50MB!');
                        return false;
                    }else {
                        return true;
                    }
                }else {
                    this.$message.error('附件只支持doc, xls, ppt, pdf, docx, xlsx, pptx格式!');
                    return false;
                }
            },


            handleUploadSuccess(res, file,fileList){
                let that = this;

                that.uploadedfileList = fileList;

                //上传成功以后
                console.log(fileList);
            },

            handleAttachmentRemove(file, fileList) {
                let that = this;
                console.log('删除的附件：')
                console.log(file, fileList);
                that.uploadedfileList = fileList;
                //..这里可以写一个删除附件的接口，免得数据库帐数据


                // createTime: (...)
                // name: "新建 XLS 工作表.xls"
                // status: "success"
                // uid: "088280e89e0d4c2a9f73391d28ce047c"
                // url: "http://192.168.1.91:8080/public/notification/800fdd569ed3483182a1c96920ceb0c4.xls"
                // __ob__: Observer {value: {…}, dep: Dep, vmCount: 0}
                // get createTime: ƒ reactiveGetter()
                // set createTime: ƒ reactiveSetter(newVal)
                // get name: ƒ reactiveGetter()
                // set name: ƒ reactiveSetter(newVal)
                // get uid: ƒ reactiveGetter()
                // set uid: ƒ reactiveSetter(newVal)
                // get url: ƒ reactiveGetter()
                // set url: ƒ reactiveSetter(newVal)
                // __proto__: Object
                //
                // (3) [{…}, {…}, {…}, __ob__: Observer]
                // 0:
                // createTime: (...)
                // name: (...)
                // status: "success"




                //是用户本地上传的file
                // if(file.response.data.attachmentUid){
                //     let index = that.notificationForm.attachmentsUid.indexOf(file.response.data.attachmentUid);
                //     that.notificationForm.attachmentsUid.splice(index,1)
                // }
                //
                // console.log(that.notificationForm.attachmentsUid)
            },

            //获取代表列表
            getNpcMemberList() {
                this.$request.httpRequest({
                    method: 'get',
                    url: '/manager/member/npcMemberList',
                    noLoading: true,
                    success: data => {

                        let npcMemberList=[];
                        for(let group of data){
                            console.log(group)
                            let memberGroup = {};
                            memberGroup.label = group.name;
                            memberGroup.value = group.uid;
                            memberGroup.children = [];
                            for(let member of group.members){
                                let tempObj = {};
                                tempObj.label = member.name;
                                tempObj.value = member.uid;
                                memberGroup.children.push(tempObj);
                            }
                            npcMemberList.push(memberGroup);
                        }
                        this.npcMemberList = npcMemberList;
                        console.log(this.npcMemberList)

                    },
                    error: e => {
                    }
                })
            },

            addOrUpdateNotification(formName){
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        switch (that.operation) {
                            case "add":
                                this.addNotification().then(
                                    data=>{
                                        this.$message({
                                            type: 'success',
                                            message: '添加成功!'
                                        });
                                        console.log(data);
                                        that.goBack();
                                    },
                                    fail=>{
                                        this.$message({
                                            type: 'fail',
                                            message: fail.message
                                        });
                                    },
                                );
                                break;
                            case "update" :
                                this.updateNotification().then(
                                    data=>{
                                        this.$message({
                                            type: 'success',
                                            message: '修改成功!'
                                        });
                                        console.log(data);
                                        that.goBack();
                                    },
                                    fail=>{
                                        this.$message({
                                            type: 'fail',
                                            message: fail.message
                                        });
                                    },
                                );
                                break;
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });


            },

            /*
            * 创建通知
            */
            addNotification(){
                let that = this;

                //uid是由后端生成，此处设置初值只是为了不让该字段为空
                that.notificationForm.uid = this.generateUid();
                console.log("接受者")
                console.log(that.receivers)
                let rece = [];
                for(let arr of that.receivers){
                    rece = arr;
                    if(rece[1]){
                        that.notificationForm.receiversUid.push(rece[1]);
                    }
                }

                that.notificationForm.attachmentsUid = [];
                for(let file of that.uploadedfileList){
                    that.notificationForm.attachmentsUid.push(file.response.data.attachmentUid);
                }

                return new Promise((resolve, reject) => {
                    that.$request.httpRequest({
                        method: 'post',
                        url: "/manager/notification",
                        noLoading: false,
                        params: that.notificationForm,
                        success: data => {
                            console.log(data, data);
                            resolve(data);
                        },
                        error: e => {
                            reject(e);
                        }
                    });
                });

            },

            /*
            * 获取通知详情
            */
            getNotificationDetail(uid){
                let that = this;
                this.$request.httpRequest({
                    method: 'get',
                    url: "/manager/notification/"+uid,
                    noLoading: true,
                    params: {},
                    success: data => {
                        that.notificationForm.uid = data.uid;
                        that.notificationForm.title = data.title;
                        that.notificationForm.publishAt = data.publishAt;
                        that.notificationForm.department = data.department;
                        that.notificationForm.content = data.content;
                        that.notificationForm.attachmentsUid = [];

                        that.receivers = data.receiversUid;
                        that.opeRecordList = data.opeRecordList;

                        console.log(data.fileList);

                        for(let file of data.fileList){
                            file.url = that.serverUrl +''+ file.url;
                        }
                        that.fileList = data.fileList;
                        that.uploadedfileList = data.fileList;

                    },
                    error: error => {
                        that.$message({
                            type: 'warning',
                            message: error.message
                        });
                    }
                });
            },


            /*
            * 修改通知
            */
            updateNotification(){
                let that = this;
                console.log("更新前的接受者");
                console.log(that.receivers);

                that.notificationForm.receiversUid =[];
                for(let arr of that.receivers){
                    that.notificationForm.receiversUid.push(arr[1]);
                }

                that.notificationForm.attachmentsUid = [];
                for(let file of that.uploadedfileList){
                    if(file.response){//说明是用户重新添加的
                        // name: (...)
                        // percentage: (...)
                        // raw: (...)
                        // response:
                        //     data: {attachmentUid: "d4bf799cdc8f46cea96887d6f51a07bd"}
                        // status: "OK"
                        // __proto__: Object
                        // size: (...)
                        // status: (...)
                        // uid: 1587006875050

                        that.notificationForm.attachmentsUid.push(file.response.data.attachmentUid);

                    }else if(file.url){//这是从后台获取的之前的附件
                        // createTime: (...)
                        // name: (...)
                        // status: "success"
                        // uid: "f34e823021fb42e6873dfcb97b0718cf"
                        // url: "http://192.168.1.91:8080/public/notification/e7e120876e204272a43cca43dbc430d9.pdf"
                        that.notificationForm.attachmentsUid.push(file.uid);
                    }
                }

                if(that.notificationForm.opeRecordList){//不能把这个属性传到后端
                    delete that.notificationForm.opeRecordList;
                }
                return new Promise((resolve, reject) => {
                    that.$request.httpRequest({
                        method: 'post',
                        url: "/manager/notification/update",
                        noLoading: false,
                        params: that.notificationForm,
                        success: data => {
                            console.log(data, data);
                            resolve(data);
                        },
                        error: e => {

                            reject(e);
                        }
                    });
                });
            },

            //富文本编辑器的内容变化时的回调
            onEditorChange(html) {
                console.log(html);
                //notificationForm.content与富文本编辑器中的内容一致
                this.notificationForm.content = html;
            },

            /**
             * 生成uid的方法
             */
            generateUid() {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");
                return uuid;
            }
        }
    }
</script>


<style lang="scss" scoped>
    @import '~@/styles/table/table';
    .ck-editor__editable {
        min-height: 400px;
        border: 1px solid #ccc!important;
    }

    .table-demo {
        padding: 25px;
    }

    .searchBar {
        margin: 10px 5px;
    }

    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .demo-input-suffix {
        width: 50%;
    }

    /*通知栏目选择和标题*/
    .el-select .el-input {
        width: 120px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

    /*修改下上传封面图片的图片框样式*/
    .el-upload--picture-card {
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        /*width: 148px;*/
        width: 200px;
        /*height: 148px;*/
        height: 120px;
        /*line-height: 146px;*/
        line-height: 120px;
        vertical-align: top
    }


    /*通知主封面图*/
    .main-cover-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .main-cover-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .main-cover-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 180px;
        height: 92px;
        line-height: 120px;
        text-align: center;
    }
    .main-cover {
        width: 180px;
        height: 120px;
        display: block;
    }

    /*小封面图*/
    .cover-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .cover-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .cover-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 92px;
        line-height: 120px;
        text-align: center;
    }
    .cover {
        width: 120px;
        height: 120px;
        display: block;
    }


    /*通知标签*/
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    /*变迁end*/


    .transfer-footer {
        margin-left: 20px;
        padding: 6px 5px;
    }

</style>