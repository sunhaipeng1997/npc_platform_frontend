<template>
    <div style="background-color: white">
        <el-page-header @back="goBack" content="编辑/查看新闻" style="padding-left: 15px"> </el-page-header>

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

                    <el-form  ref="form1" :rules="rules" :disabled="disabled" :model="newsForm"  label-position="top"  label-width="100px" size="mini">
                        <el-form-item label="栏目与标题" required prop="title"
                                      :rules="{ required: true, message: '栏目和标题不能为空', trigger: 'blur' }">

                            <el-col :span="24" >
                                <el-input placeholder="请输入新闻标题" v-model="newsForm.title" class="input-with-select">
                                    <el-select v-model="newsForm.newsTypeUid" slot="prepend" placeholder="请选择新闻栏目" style="width: 150px">
                                        <el-option v-for="(item,index) in newsTypeList" :label="item.name" :key="index" :value="item.uid"></el-option>
                                    </el-select>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>

                    <el-form  ref="form2"  :disabled="disabled" :model="newsForm" label-position="top" label-suffix="(支持.jpg/.png格式图片，推荐在500Kb以内，效果较佳)"   label-width="100px" size="mini">
                        <el-form-item required label="封面与摘要"  >

                            <!--上传新闻的主封面图-->
                            <el-col :span="5" >
                                <el-upload
                                        class="main-cover-uploader"
                                        ref="mainCoverUploader"
                                        :action="uploadImgServerApi"
                                        :multiple="false"
                                        :data="mainCoverSize"
                                        name="image"
                                        :show-file-list="false"
                                        :auto-upload="false"
                                        :accept="acceptImageType"
                                        :on-change="handleMainCoverChange"
                                        :on-preview="handlePictureCardPreview"
                                        :before-upload="checkImageType"
                                        :on-remove="handleRemove"
                                >

                                    <img v-if="coverLocalUrl" :src="coverLocalUrl" class="main-cover">
                                    <i v-else class="el-icon-plus main-cover-uploader-icon"></i>
                                    <div v-if="!coverLocalUrl" style="font-size:6px;color: gray">主封面</div>
                                    <!--<i slot="trigger" class="el-icon-plus"></i>-->

                                </el-upload>
                            </el-col>

                            <!--上传新闻的小封面图-->
                            <el-col :span="4" >
                                <el-upload
                                        class="cover-uploader"
                                        :action="uploadImgServerApi"
                                        :show-file-list="false"
                                        name="image"
                                        :auto-upload="false"
                                        :accept="acceptImageType"
                                        :on-change="handleSmallCoverChange"
                                        :on-preview="handlePictureCardPreview"
                                        :before-upload="checkImageType"
                                        :on-remove="handleRemove"
                                        style="text-align: right"
                                >
                                    <img v-if="smallCoverLocalUrl" :src="smallCoverLocalUrl" class="cover">
                                    <i v-else class="el-icon-plus cover-uploader-icon"></i>
                                    <div v-if="!smallCoverLocalUrl" style="font-size:6px;color: gray">列表封面</div>
                                    <!--<i slot="trigger" class="el-icon-plus"></i>-->

                                </el-upload>
                            </el-col>


                            <!--摘要内容-->
                            <el-col :span="14" :offset="1">
                                <el-input
                                          placeholder="(选填)摘要内容"
                                          v-model="newsForm.newsAbstract"
                                          clearable
                                          maxlength="120"
                                          show-word-limit
                                          type="textarea"
                                          :autosize="{ minRows: 6, maxRows: 6}"
                                >
                                </el-input>
                            </el-col>

                        </el-form-item>
                    </el-form>

                    <!--分割线-->
                    <el-divider content-position="right">以下进行正文编辑</el-divider>

                    <el-form ref="form5" :disabled="disabled" :model="newsForm">
                        <el-form-item  prop="content">
                            <template>
                                <div class="table">
                                    <!--富文本编辑器-->
                                    <div id="editor">
                                        <ckeditor :editor="editor" @ready="onReady" v-model="newsForm.content" :config="editorConfig"></ckeditor>
                                    </div>
                                </div>
                            </template>
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox v-model="newsForm.showOriginal">显示原文(勾选此选项，则表示移动端直接显示链接所指网页)</el-checkbox>
                            <el-input size="mini" placeholder="请粘贴新闻的原文网页链接" v-model="newsForm.originalUrl">
                                <template slot="prepend">原文链接</template>
                            </el-input>
                        </el-form-item>
                    </el-form>

                    <!--分割线-->
                    <el-divider content-position="right"><i class="el-icon-mobile-phone"></i> 小程序/APP预览</el-divider>

                    <el-form ref="form3" :disabled="disabled" :model="newsForm" label-position="top" label-width="100px" size="mini">
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="发布与作者" >
                                    <el-row>
                                        <el-col :span="14">
                                            <el-date-picker
                                                    placeholder="选择发布时间"
                                                    v-model="newsForm.publishAt"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    style="width: 180px;">
                                            </el-date-picker>
                                        </el-col>

                                        <el-col :span="10" style="text-align: right">
                                            <el-input
                                                    placeholder="请输入作者"
                                                    v-model="newsForm.author"
                                                    prefix-icon="el-icon-user"
                                                    style="width: 120px;"  >
                                            </el-input>
                                        </el-col>
                                    </el-row >
                                </el-form-item>
                            </el-col>

                            <el-col :span="11" :offset="1">
                                <el-form-item label="主题或标签" :disabled="disabled">
                                    <el-tag :disabled="disabled"
                                            v-for="tag in tagList"
                                            :key="tag"
                                            effect="plain"
                                            closable
                                            :disable-transitions="false"
                                            @close="CloseTag(tag)">

                                        {{tag}}
                                    </el-tag>

                                    <el-input
                                            class="input-new-tag"
                                            v-if="inputTagVisible"
                                            v-model="inputTagValue"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="InputTagConfirm"
                                            @blur="InputTagConfirm"
                                    >
                                    </el-input>
                                    <el-button :disabled="disabled" v-else class="button-new-tag" size="small"  @click="showInputTag">+标签</el-button>

                                </el-form-item>
                            </el-col>

                            <!--预览二维码-->
                            <el-col :span="3" >
                                <div style="text-align: right">
                                    <canvas id="canvas" ></canvas>

                                    <!--<qr-code :data="QRCodeData" :color="qrColor" ref="qrCode" @change="refreshQRCode(e)"></qr-code>-->
                                </div>
                            </el-col>

                        </el-row >
                    </el-form>


                    <el-form ref="form4"  :model="newsForm" label-position="top" label-width="100px" size="mini">
                        <el-row >
                            <el-col :span="9" >
                                <el-form-item label="设置优先级"  :disabled="disabled">
                                    <el-row>
                                        <el-col :span="14">
                                            <el-radio-group v-model="newsForm.whereShow" style="width:180px" :disabled="disabled">
                                                <el-row justify="space-between">
                                                    <el-col :span="8">
                                                        <el-radio  :label="0" >常规</el-radio>
                                                    </el-col>
                                                    <el-col :span="8" style="text-align: center">
                                                        <el-radio  :label="1" >置顶</el-radio>
                                                    </el-col>
                                                    <el-col :span="8" style="text-align: right">
                                                        <el-radio  :label="2">轮播</el-radio>
                                                    </el-col>
                                                </el-row>
                                            </el-radio-group>
                                        </el-col>
                                        <el-col :span="10">
                                            <el-col :span="16" style="text-align: right">
                                                <div style="color: gray">移动端推送</div>
                                            </el-col>

                                            <el-col :span="8" style="text-align: right">
                                                <el-switch v-model="newsForm.pushNews" :disabled="disabled"></el-switch>
                                            </el-col>
                                        </el-col>
                                    </el-row>

                                </el-form-item>

                            </el-col>

                            <el-col :span="11" :offset="1">
                                <el-form-item label="操作与预览"  size="mini" >
                                    <el-button @click="goBack" :disabled="disabled">取消</el-button>
                                    <el-button type="primary" @click="submitNews('form1')" :disabled="disabled">保存</el-button>
                                    <!--<el-button  @click="toReview" :disabled="disabled">提交审核</el-button>-->
                                    <!--<el-button type="primary" plain @click="onSubmit">刷新二维码</el-button>-->
                                </el-form-item>
                            </el-col>

                            <!--预览二维码-->
                            <!--<el-col :span="2" >-->
                            <!--<div style="text-align: right">-->
                            <!--<qr-code :data="QRCodeData"></qr-code>-->
                            <!--</div>-->
                            <!--</el-col>-->

                            <el-col :span="3" >
                                <div style="text-align: right">
                                    <el-form-item label="-"   size="mini">
                                        <el-button type="primary" plain size="mini" @click="refreshQRCode">刷新二维码</el-button>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>

                </el-col>

                <!--新增新闻卡片-->
                <el-col :span="5" :offset="1" style="padding-left: 25px;padding-right: 25px" >
                    <el-card v-if="operation === 'add'" shadow="always" :body-style="{ padding: '0px' }">

                        <!--主封面图 样式-->
                        <el-image class="image" :src="demoMainCoverUrl">
                            <!--如果加载失败就用本地图片-->
                            <div slot="error" class="image-slot" >
                                <img class="image" src="src/assets/images/main_cover.png">
                            </div>
                        </el-image>

                        <div style="padding: 10px;">

                            <el-row >
                                <el-col :span="20">
                                    <div style="margin-bottom: 5px">标题(推荐标题字数在28个汉字以内，多余字数将以省略号显示)</div>
                                    <el-row>
                                        <el-col :span="12">
                                            <div style="color: gray;">浏览量xx</div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div style="color: gray;text-align: right;margin-right: 10px">2020-xx-xx</div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="4">
                                    <i class="el-icon-picture-outline small-cover-icon"></i>
                                </el-col>
                            </el-row>
                        </div>

                    </el-card>

                    <el-card v-else shadow="always" :body-style="{ padding: '0px' }">

                        <!--主封面图 样式-->
                        <el-image class="image" :src="coverLocalUrl">
                            <!--如果加载失败就用本地图片-->
                            <div slot="error" class="image-slot" >
                                <img class="image" src="src/assets/images/main_cover.png">
                            </div>
                        </el-image>

                        <div style="padding: 10px;">
                            <el-row >
                                <el-col :span="20">
                                    <div style="margin-bottom: 5px">{{newsForm.title}}</div>
                                    <el-row>
                                        <el-col :span="12">
                                            <div style="color: gray;">阅读量{{newsForm.readTimes}}</div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div style="color: gray;text-align: right;margin-right: 10px">{{newsForm.publishAt}}</div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="4">
                                    <el-image style="width: 44px;height: 44px" :src="smallCoverLocalUrl"></el-image>
                                </el-col>
                            </el-row>
                        </div>

                    </el-card>

                </el-col>

            </el-row>

            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import QRCode from 'qrcode'
    import DecoupledDoc from '@ckeditor/ckeditor5-build-decoupled-document';
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn' //中文包
    const upload = require('../../../assets/utils/upload');

    import { Loading } from 'element-ui';

    export default {
        name: "editNews",
        components: {
            QRCode: QRCode,
            DecoupledDoc:DecoupledDoc,
            Loading:Loading
        },
        data() {
            return {
                serverUrl:this.API.ServerUrl,
                demoMainCoverUrl:this.API.ServerUrl + "/public/news/main_cover.png",
                timestamp:Date(),

                editor: DecoupledDoc,
                editorData: '<h1>文档型富文本编辑器测试</h1>',
                editorConfig: {
                    // 编辑器的配置
                    language: 'zh-cn',  // 中文
                    extraPlugins: [ upload.MyCustomUploadAdapterPlugin ],
                },

                //从服务器获取的新闻栏目列表
                newsTypeList:[],
                //add、update、viewDetails
                operation:'add',
                //是否只读
                disabled:false,

                newsForm:{
                    uid:'',
                    newsTypeUid:'',
                    title:'',

                    coverUrl:'',
                    smallCoverUrl:'',
                    newsAbstract:'',

                    publishAt:'',
                    author:'',

                    tags:'',

                    whereShow:0,
                    pushNews:false,

                    content:'',

                    //新闻来源1-表示自定义编辑；2-表示直接显示原文链接网页
                    showOriginal:false,
                    originalUrl:'',
                },
                opeRecordList:[{}],
                //表示该二维码是新闻业务,与新闻UID以‘#’号隔开
                //新闻uid
                QRCodeData: 'news#',
                qrColor: {
                    dark:'#409EFF',
                    light:'#ffffff'
                },

                // tagList:['青年大学习','脱贫攻坚','两会精神'],
                tagList:['脱贫攻坚','学习时代'],

                //封面图
                coverLocalUrl: '',
                smallCoverLocalUrl:'',
                acceptImageType:'.png,.jpg,.jpeg',
                //上传新闻图片的接口
                uploadImgServerApi: this.API.UploadNewsImage,
                //调用图片上传接口时的附带数据
                mainCoverSize:{
                    //指定图片压缩尺寸2.35 ：1
                    width:470,
                    height:200
                },

                //新闻标签
                inputTagVisible: false,
                inputTagValue: '',

                //上传组件图片窗口上蒙层弹窗
                dialogVisible: false,
                dialogImageUrl: '',

                imageList: [
                    {name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}
                ],

                mainCoverFormData : new FormData(),
                smallCoverFormData : new FormData(),

                rules: {
                    title: [
                        {
                            required: true,
                            message: '标题不能为空',
                            trigger: 'blur',
                        },
                    ],
                    newsTypeUid: [
                        {
                            required: true,
                            message: '请选择类型',
                            trigger: 'blur',
                        },
                    ]

                },


            };
        },
        created(){
            let that = this;
            this.getNewsType();
            this.operation = this.$route.query.operation;
            switch (this.operation) {
                case "add":
                    //初始化一条操作记录
                    that.opeRecordList=[{
                        action: "创建",
                        createTime:Date(),
                        opTime:Date(),
                        feedback:"创建"+that.newsForm.title,
                        operator: "管理员",
                        resultStatusName: "未保存"
                    }];
                    break;
                case "update" :
                    this.getNewsDetail(this.$route.query.uid);
                    break;
                case "read" :
                    this.getNewsDetail(this.$route.query.uid);
                    this.disabled = true;//禁用各表单
                    break;
            }
            this.generateQR();
        },

        mounted() {
            this.refreshQRCode();
        },

        methods: {
            /*
            * 页面返回
            */
            goBack() {
                console.log('go back');
                this.$router.push({
                    path:'/basic_info/news'
                });
            },

            onReady( editor )  {
                // 在可编辑区域之前插入工具栏。
                editor.ui.getEditableElement().parentElement.insertBefore(
                    editor.ui.view.toolbar.element,
                    editor.ui.getEditableElement()
                );
            },

            /*
            * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
            *
            * 在选择文件之后就将图片显示出来，因为有两张图片要传，用自动提交和手动提交都不大方便，所以改为自定义方法上传
            * 然后等待其他表单数据一起提交
            * 避免多写接口
            *
            * 之前的用法有些不方便，比如用户如果上传了图片，但是又取消了表单提交。
            * 这种情况就只好又写一个接口去删除已经上传的文件
            */
            handleMainCoverChange(file, fileList){
                console.log("文件改变事件中的文件:");
                console.log(file);
                let that = this;
                if(that.checkImageType(file.raw)){
                    that.coverLocalUrl = URL.createObjectURL(file.raw);
                    if(that.mainCoverFormData.has("image")){
                        that.mainCoverFormData.set('image',file.raw);
                    }else {
                        that.mainCoverFormData.append('image',file.raw);
                        that.mainCoverFormData.append('width',470);//主封面压缩的尺寸
                        that.mainCoverFormData.append('height',200);
                    }
                }

            },


            handleSmallCoverChange(file, fileList){
                console.log("文件改变事件");
                console.log(file);
                let that = this;
                if(that.checkImageType(file.raw)){
                    that.smallCoverLocalUrl = URL.createObjectURL(file.raw);
                    if(that.smallCoverFormData.has("image")){
                        that.smallCoverFormData.set('image',file.raw);
                    }else {
                        that.smallCoverFormData.append('image',file.raw);
                        that.smallCoverFormData.append('width',120);//小封面压缩的尺寸
                        that.smallCoverFormData.append('height',120);
                    }
                }

            },

            checkImageType(file) {
                let that = this;
                // this.coverLocalUrl = URL.createObjectURL(file);
                console.log("文件的类型:");
                console.log(file.type);
                const isJpgOrPng = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/jpg');
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isJpgOrPng) {
                    that.$message.error('上传图片只能是JPG和PNG格式!');
                }
                if (!isLt10M) {
                    that.$message.error('上传图片大小不能超过 10MB!');
                }
                return isJpgOrPng && isLt10M;
            },

            // handleRemove(file, fileList) {
            //     console.log(file, fileList);
            // },

            handleRemove(file) {
                console.log("点击删除图片");
                console.log(file);
            },

            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

            submitUploadMainCover() {
                this.$refs.mainCoverUploader.submit();
            },


            uploadCover(data,oldUrl) {
                var that = this;
                return new  Promise((resolve, reject) => {
                    if(data.has("image")){
                        that.$request.httpRequest({
                            headers:{
                                'content-type':'multipart/form-data'
                            },
                            method: 'post',
                            url: "manager/news/upload_image",
                            noLoading: true,
                            params: data,
                            success: data => {
                                console.log(data, data);
                                that.dialogImageUrl = that.API.ServerUrl + data.url +"";
                                // this.dialogVisible = true;
                                resolve(data.url);
                            },
                            error: e => {
                                reject(e);
                            }
                        });
                    }else {//用户没有选择图片
                        resolve(oldUrl);
                    }
                });
            },

            onSubmit() {
                console.log('submit!');
            },

            /*
            * 处理删除新闻标签
            */
            CloseTag(tag) {
                this.tagList.splice(this.tagList.indexOf(tag), 1);
            },

            /*
            * 显示新输入的标签内容
            */
            showInputTag() {
                this.inputTagVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            /*
            * 处理 确认输入的新闻标签
            */
            InputTagConfirm() {
                let inputTagValue = this.inputTagValue;
                if (inputTagValue) {
                    this.tagList.push(inputTagValue);
                }
                this.inputTagVisible = false;
                this.inputTagValue = '';
            },

            /*
            * 获取新闻栏目列表
            */
            getNewsType() {
                this.$request.httpRequest({
                    method: 'get',
                    url: "/manager/news_type",
                    noLoading: true,
                    params: {
                        // status: 1,//所有栏目都可以，并不需要只向启用中的栏目添加新闻
                        pageSize: 20,
                        property: 'sequence',
                        direction: 'asc'
                    },
                    success: data => {
                        console.log(data, data)
                        this.newsTypeList = data.content;
                    },
                    error: e => {

                    }
                })
            },


            /*
            * 创建新闻
            */
            addNews(){
                let that = this;

                //uid是由后端生成，此处设置初值只是为了不让该字段为空
                this.newsForm.uid = this.generateUid();

                //服务端直接存储一个字符串，没有必要单独一张表来维护标签
                //将标签列表转换为字符串
                this.newsForm.tags = that.tagList.toString();

                return new Promise((resolve, reject) => {
                    that.$request.httpRequest({
                        method: 'post',
                        url: "/manager/news",
                        noLoading: true,
                        params: that.newsForm,
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
            * 获取新闻详情
            */
            getNewsDetail(uid){
                let that = this;
                this.$request.httpRequest({
                    method: 'get',
                    url: "/manager/news/"+uid,
                    noLoading: true,
                    params: {},
                    success: data => {
                        console.log(data);
                        that.newsForm = JSON.parse(JSON.stringify(data));//

                        if(that.newsForm.opeRecordList){//不能把这个属性加入到表单中
                            that.opeRecordList = that.newsForm.opeRecordList;
                            delete that.newsForm.opeRecordList;
                        }
                        that.newsForm.content = data.content;

                        if(data.coverUrl){
                            that.coverLocalUrl = that.API.ServerUrl + data.coverUrl+'';
                        }
                        if(data.smallCoverUrl){
                            that.smallCoverLocalUrl = that.API.ServerUrl + data.smallCoverUrl+'';
                        }
                        //服务端直接存储一个字符串，没有必要单独一张表来维护标签
                        //将标签字符串再以逗号为分隔符解析回来
                        that.tagList =  data.tags.split(',');

                        //刷新二维码
                        that.refreshQRCode();
                    },
                    error: e => {

                    }
                });
            },



            submitNews(formName) {
                var that = this;
                if(that.smallCoverLocalUrl && that.coverLocalUrl){
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            const loading = this.$loading({
                                lock: false,
                                text: '正在执行操作，请您稍等~~~',
                                spinner: 'el-icon-loading',
                                background: 'rgba(0, 0, 0, 0.7)'
                            });

                            that.uploadCover(that.mainCoverFormData,that.newsForm.coverUrl).then(
                                mainCoverUrl =>{
                                    that.newsForm.coverUrl = mainCoverUrl;
                                    that.uploadCover(that.smallCoverFormData,that.newsForm.smallCoverUrl).then(
                                        smallCoverUrl =>{
                                            that.newsForm.smallCoverUrl = smallCoverUrl;
                                            switch (this.operation) {
                                                case "add":
                                                    that.addNews().then(
                                                        res =>{
                                                            //关闭加载蒙层
                                                            loading.close();

                                                            that.$message({
                                                                type: 'success',
                                                                message: '添加成功'
                                                            });
                                                            that.goBack();
                                                        },
                                                        error => {
                                                            //关闭加载蒙层
                                                            loading.close();
                                                            that.$message({
                                                                type: 'warning',
                                                                message: error.message
                                                            });
                                                        }
                                                    );
                                                    break;
                                                case "update" :
                                                    this.updateNews().then(
                                                        res =>{
                                                            //关闭加载蒙层
                                                            loading.close();
                                                            that.$message({
                                                                type: 'success',
                                                                message: '修改成功'
                                                            });
                                                            that.goBack();
                                                        },
                                                        error => {
                                                            //关闭加载蒙层
                                                            loading.close();
                                                            that.$message({
                                                                type: 'warning',
                                                                message: error.message
                                                            });
                                                        }
                                                    );
                                                    break;
                                            }
                                        },
                                        error => {
                                            //关闭加载蒙层
                                            loading.close();
                                            that.$message({
                                                type: 'warning',
                                                message: error.message
                                            });
                                        }
                                    );
                                },
                                error => {
                                    //关闭加载蒙层
                                    loading.close();
                                    that.$message({
                                        type: 'warning',
                                        message: error.message
                                    });
                                }
                            );

                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });

                }else {
                    that.$message({
                        type: 'warning',
                        message: '必须要大小两张封面'
                    });
                }

            },

            /*
            * 修改新闻
            */
            updateNews(){
                let that = this;
                //服务端直接存储一个字符串，没有必要单独一张表来维护标签
                //将标签列表转换为字符串
                this.newsForm.tags = that.tagList.toString();

                if(this.newsForm.opeRecordList){//不能把这个属性传到后端
                    delete this.newsForm.opeRecordList;
                }
                console.log(that.newsForm);
                return new Promise((resolve, reject) => {
                    that.$request.httpRequest({
                        method: 'post',
                        url: "/manager/news/update",
                        noLoading: true,
                        params: that.newsForm,
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
            * 刷新预览二维码
            */
            refreshQRCode(){
                let that = this;
                console.log();
                console.log("刷新二维码：");
                let uid = that.newsForm.uid;
                console.log(uid);
                this.QRCodeData = 'news#'+uid;
                this.generateQR();
                // this.$refs.qrCode.generateQR();
            },

            //富文本编辑器的内容变化时的回调
            onEditorChange(html) {
                console.log(html);
                //时刻保持newsForm.content与富文本编辑器内容一致
                this.newsForm.content = html;
            },

            generateQR(){
                let that = this;

                //配置
                let opts = {};
                //纠错等级M (Medium)	~15%
                opts.errorCorrectionLevel = 'M';
                //质量
                opts.quality = 0.3;
                opts.type = 'image/jpeg';  //[可选值: "png", "svg", "utf8"]
                opts.width = 92;
                opts.margin = 0;
                opts.color = {
                    //默认设置成element组件的默认色
                    dark:"#409EFF",
                    light:"#ffffff"
                };

                //建立画布
                let canvas = document.getElementById('canvas');

                //将二维码绘制在画布上
                QRCode.toCanvas(
                    canvas,
                    that.QRCodeData,
                    opts,
                    function (error) {
                        if (error) console.error(error);

                        console.log('QRCode success!');
                        console.log('QRCode：'+that.QRCodeData);
                    });
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

    /*新闻栏目选择和标题*/
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


    /*新闻主封面图*/
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


    /*新闻标签*/
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

</style>