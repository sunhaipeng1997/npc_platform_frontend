<!--
    李亚林
    2020.1.10
-->

<template>
    <div style="padding: 25px">
<!--            <el-tabs v-model="activeTabName" @tab-click="handleLevelOneTabClick" tab-position="left" style="height: 100%;">-->

                <!--第二个纵向tab对文章管理-->
<!--                <el-tab-pane label="文章管理" name="articleManagement">-->
                    <div style="padding-left: 10px;padding-top: 0;padding-right: 25px;border: 0;border-radius: 10px;">

                        <el-card class="list-content" shadow="hover">
                            <template v-if="$route.meta.check">
                                <!--搜索查询表单-->
                                <div class="searchBar">
                                    <el-form ref="form" :model="searchNewsForm" tab-position="left">
                                        <!--type="flex"  justify="space-between"-->
                                        <el-row :gutter="10" >
                                            <el-col :span="4">
                                                <el-form-item label="新闻标题" label-width="70px" size="mini" >
                                                    <el-input placeholder="输入标题"  v-model="searchNewsForm.title" ></el-input>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :span="3" >
                                                <el-form-item label="作者" label-width="40px" size="mini" >
                                                    <el-input placeholder="输入作者"  v-model="searchNewsForm.author" ></el-input>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :span="4" >
                                                <el-form-item label="栏目" label-width="40px" size="mini" >
                                                    <el-select v-model="searchNewsForm.newsTypeUid" placeholder="选择栏目">
                                                        <el-option
                                                                v-for="(item,index) in newsTypeOptions"
                                                                :key="index"
                                                                :label="item.name"
                                                                :value="item.uid">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :span="5" >
                                                <el-form-item label="位置/优先级" label-width="90px" size="mini" >
                                                    <el-select v-model="searchNewsForm.whereShow" placeholder="选择位置">
                                                        <el-option
                                                                v-for="(item,index) in whereShowOptions"
                                                                :key="index"
                                                                :label="item.name"
                                                                :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :span="4" >
                                                <el-form-item label="状态" label-width="40px" size="mini" >
                                                    <el-select v-model="searchNewsForm.status" placeholder="选择状态" >
                                                        <el-option
                                                                v-for="(item,index) in newsStatusOptions"
                                                                :key="index"
                                                                :label="item.name"
                                                                :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>

                                            <el-col :span="4" style="text-align: right">

                                                <!--搜索新闻-->
                                                <el-button size="mini" @click="searchNews()">搜索</el-button>
                                                <el-button type="primary" size="mini" @click="goAddNewsPage">添加</el-button>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </div>

                                <el-table v-loading="newsTableLoading" border size="mini" :header-row-style="{ 'font-size':'15px'}" :data="newsTableData" style="width: 100%" class="table-content">
                                    <el-table-column label="序号" fixed type="index"  align="center"  width="60"/>
                                    <el-table-column  label="标题" fixed prop="title"  width="450" align="center"></el-table-column>
                                    <el-table-column  label="作者" prop="author"  width="130" align="center"></el-table-column>
                                    <el-table-column  label="发布时间" prop="publishAt" sortable width="110" align="center"></el-table-column>
                                    <el-table-column  label="阅读量" prop="readTimes" sortable width="90" align="center"></el-table-column>
                                    <el-table-column  label="栏目" prop="newsTypeName"  width="90" align="center"></el-table-column>
                                    <el-table-column  label="标签" prop="tags"  width="200" align="center"></el-table-column>
                                    <el-table-column  label="状态" prop="statusName"  width="70" align="center"></el-table-column>
                                    <el-table-column label="操作" fixed="right"  width="260" align="center" class-name="operation">
                                        <template slot-scope="scope">
                                            <a v-if="$route.meta.edit && (scope.row.status === 1 || scope.row.status === 3)" class="item" @click="toReview(scope.row)">提交审核</a>
                                            <a v-if="$route.meta.edit && scope.row.status === 4" class="item" @click="publish(scope.row)">发布</a>
                                            <a v-if="$route.meta.edit && scope.row.status !== 2" class="item" @click="goUpdateNews(scope.row)">修改</a>
                                            <a v-if="$route.meta.edit && scope.row.status === 5 &&  scope.row.whereShow !== 1" class="item" @click="setPriority(scope.row,1)">置顶</a>
                                            <a v-if="$route.meta.edit && scope.row.status === 5 &&  scope.row.whereShow === 1" class="item" @click="setPriority(scope.row,0)">取消置顶</a>
                                            <a v-if="$route.meta.edit && scope.row.status === 5 && scope.row.whereShow !== 2 " class="item" @click="setPriority(scope.row,2)">轮播</a>
                                            <a v-if="$route.meta.edit && scope.row.status === 5 && scope.row.whereShow === 2 " class="item" @click="setPriority(scope.row,0)">取消轮播</a>
                                            <a v-if="$route.meta.edit" class="item" @click="goNewsDetailsPage(scope.row)">查看</a>
                                            <a v-if="$route.meta.delete && scope.row.status !== 2" class="item-danger" @click="deleteNews(scope.row)">删除</a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-pagination v-if="$route.meta.check" :total="totalNews" :pager-count="5" :page-sizes="[10, 20, 30, 50]"
                                               :page-size="newsListPageSize" :current-page="newsListCurrentPage" background layout="total, sizes, prev, pager, next, jumper"
                                               class="pagination"
                                               @size-change="handleNewsListPageSizeChange"
                                               @current-change="handleNewsListCurrentPage"
                                />

                            </template>

                            <div v-else class="no-data">
                                <i class="fa fa-danger"></i>
                                您暂时没有查看的权限！！！
                            </div>
                        </el-card>


                        <!--里面再嵌套一个tabs组件，主要用于分类、简化查询-->
                        <el-tabs v-if="false" v-model="activeNewsTabName"  @tab-click="handleTabsOfNewsManagementClick" type="border-card" >
                            <!--轮播新闻-->
                            <el-tab-pane name="rotatingNews">
                                <span slot="label"><i class="el-icon-video-play"></i>轮播新闻</span>
                                <el-row>
                                    <el-col :span="5" v-for="(news, index) in newsTableData" :key="index" :offset="index > 0 ? 1 : 0">
                                        <el-card shadow="always" :body-style="{ padding: '0px' }">
                                            <!--主封面图 样式-->
                                            <el-image class="image" :src="serverUrl+news.coverUrl">
                                                <!--如果加载失败就用本地图片-->
                                                <div slot="error" class="image-slot" >
                                                    <img class="image" src="src/assets/images/main_cover.png">
                                                </div>
                                            </el-image>

                                            <div style="padding: 10px;">
                                                <el-row >
                                                    <el-col :span="20">
                                                        <div style="margin-bottom: 5px">{{news.title}}</div>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <div style="color: gray;">阅读量{{news.readTimes}}</div>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <div style="color: gray;text-align: right;margin-right: 10px">{{news.publishAt}}</div>
                                                            </el-col>
                                                        </el-row>
                                                    </el-col>
                                                    <el-col :span="4">
                                                        <el-image style="width: 44px;height: 44px" :src="serverUrl+news.smallCoverUrl"></el-image>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                            <el-row style="padding: 10px">
                                                <el-button type="text" class="button" style="margin-left: 5px" @click="setPriority(news,0)">取消轮播</el-button>
                                                <el-button type="text" class="button" @click="goUpdateNews(news)">修改</el-button>
                                                <el-button type="text" class="button" @click="goNewsDetailsPage(news)">详情</el-button>
                                            </el-row>

                                        </el-card>

                                    </el-col>
                                </el-row>

                            </el-tab-pane>

                            <!--置顶新闻-->
                            <el-tab-pane name="topNews">
                                <span slot="label"><i class="el-icon-thumb"></i>置顶新闻</span>
                                <el-row>
                                    <el-col :span="5" v-for="(news, index) in newsTableData" :key="index" :offset="index > 0 ? 1 : 0">
                                        <el-card shadow="always" :body-style="{ padding: '0px' }">

                                            <!--主封面图 样式-->
                                            <el-image class="image" :src="serverUrl+news.coverUrl">
                                                <!--如果加载失败就用本地图片-->
                                                <div slot="error" class="image-slot" >
                                                    <img class="image" src="src/assets/images/main_cover.png">
                                                </div>
                                            </el-image>

                                            <div style="padding: 10px;">
                                                <el-row >
                                                    <el-col :span="20">
                                                        <div style="margin-bottom: 5px">{{news.title}}</div>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <div style="color: gray;">阅读量{{news.readTimes}}</div>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <div style="color: gray;text-align: right;margin-right: 10px">{{news.publishAt}}</div>
                                                            </el-col>
                                                        </el-row>
                                                    </el-col>
                                                    <el-col :span="4">
                                                        <el-image style="width: 44px;height: 44px" :src="serverUrl+news.smallCoverUrl"></el-image>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                            <el-row style="padding: 10px">
                                                <el-button type="text" class="button" style="margin-left: 5px" @click="setPriority(news,0)">取消置顶</el-button>
                                                <el-button type="text" class="button" @click="goUpdateNews(news)">修改</el-button>
                                                <el-button type="text" class="button" @click="goNewsDetailsPage(news)">详情</el-button>
                                            </el-row>

                                        </el-card>

                                    </el-col>
                                </el-row>
                            </el-tab-pane>

                            <!--全部-->
                            <el-tab-pane name="allNews">
                                <span slot="label"><i class="el-icon-files"></i>全部</span>

                            </el-tab-pane>
                        </el-tabs>
                    </div>
<!--                </el-tab-pane>-->

                <!--第三个纵向tab主要用于快捷查询 审核进度-->
<!--                <el-tab-pane v-if="false" label="审核进度" name="queryProgress">-->
<!--                    <div style="padding-left: 10px;padding-top: 0;padding-right: 25px">-->

<!--                        &lt;!&ndash;里面再嵌套一个tabs组件，主要用于快捷查询处理审核流程中的新闻&ndash;&gt;-->
<!--                        <el-tabs v-model="activeQueryProgressTabName"  @tab-click="handleTabsOfQueryProgressClick"  type="border-card">-->
<!--                            <el-tab-pane  name="underReview">-->
<!--                                <span slot="label"><i class="el-icon-edit-outline"></i>审核中</span>-->
<!--                                <el-row>-->
<!--                                    <el-col :span="5" v-for="(news, index) in newsTableData" :key="index" :offset="index > 0 ? 1 : 0">-->
<!--                                        <el-card shadow="always" :body-style="{ padding: '0px' }">-->

<!--                                            &lt;!&ndash;主封面图 样式&ndash;&gt;-->
<!--                                            <el-image class="image" :src="serverUrl+news.coverUrl">-->
<!--                                                &lt;!&ndash;如果加载失败就用本地图片&ndash;&gt;-->
<!--                                                <div slot="error" class="image-slot" >-->
<!--                                                    <img class="image" src="../../../assets/images/main_cover.png">-->
<!--                                                </div>-->
<!--                                            </el-image>-->

<!--                                            <div style="padding: 10px;">-->
<!--                                                <el-row >-->
<!--                                                    <el-col :span="20">-->
<!--                                                        <div style="margin-bottom: 5px">{{news.title}}</div>-->
<!--                                                        <el-row>-->
<!--                                                            <el-col :span="12">-->
<!--                                                                <div style="color: gray;">阅读量{{news.readTimes}}</div>-->
<!--                                                            </el-col>-->
<!--                                                            <el-col :span="12">-->
<!--                                                                <div style="color: gray;text-align: right;margin-right: 10px">{{news.publishAt}}</div>-->
<!--                                                            </el-col>-->
<!--                                                        </el-row>-->
<!--                                                    </el-col>-->
<!--                                                    <el-col :span="4">-->
<!--                                                        <el-image style="width: 44px;height: 44px" :src="serverUrl+news.smallCoverUrl"></el-image>-->
<!--                                                    </el-col>-->
<!--                                                </el-row>-->
<!--                                            </div>-->
<!--                                            <el-row style="padding: 10px">-->
<!--                                                <el-button type="text" class="button" @click="goNewsDetailsPage(news)">详情</el-button>-->
<!--                                            </el-row>-->

<!--                                        </el-card>-->

<!--                                    </el-col>-->
<!--                                </el-row>-->
<!--                            </el-tab-pane>-->

<!--                            <el-tab-pane  name="notApproved">-->
<!--                                <span slot="label"><i class="el-icon-edit-outline"></i>未通过</span>-->
<!--                                <el-row>-->
<!--                                    <el-col :span="5" v-for="(news, index) in newsTableData" :key="index" :offset="index > 0 ? 1 : 0">-->
<!--                                        <el-card shadow="always" :body-style="{ padding: '0px' }">-->

<!--                                            &lt;!&ndash;主封面图 样式&ndash;&gt;-->
<!--                                            <el-image class="image" :src="serverUrl+news.coverUrl">-->
<!--                                                &lt;!&ndash;如果加载失败就用本地图片&ndash;&gt;-->
<!--                                                <div slot="error" class="image-slot" >-->
<!--                                                    <img class="image" src="../../../assets/images/main_cover.png">-->
<!--                                                </div>-->
<!--                                            </el-image>-->

<!--                                            <div style="padding: 10px;">-->
<!--                                                <el-row >-->
<!--                                                    <el-col :span="20">-->
<!--                                                        <div style="margin-bottom: 5px">{{news.title}}</div>-->
<!--                                                        <el-row>-->
<!--                                                            <el-col :span="12">-->
<!--                                                                <div style="color: gray;">阅读量{{news.readTimes}}</div>-->
<!--                                                            </el-col>-->
<!--                                                            <el-col :span="12">-->
<!--                                                                <div style="color: gray;text-align: right;margin-right: 10px">{{news.publishAt}}</div>-->
<!--                                                            </el-col>-->
<!--                                                        </el-row>-->
<!--                                                    </el-col>-->
<!--                                                    <el-col :span="4">-->
<!--                                                        <el-image style="width: 44px;height: 44px" :src="serverUrl+news.smallCoverUrl"></el-image>-->
<!--                                                    </el-col>-->
<!--                                                </el-row>-->
<!--                                            </div>-->
<!--                                            <el-row style="padding: 10px">-->
<!--                                                <el-button type="text" class="button" style="margin-left: 5px" @click="toReview(news.uid)">提交审核</el-button>-->
<!--                                                <el-button type="text" class="button" @click="goUpdateNews(news)">修改</el-button>-->
<!--                                                <el-button type="text" class="button" @click="goNewsDetailsPage(news)">详情</el-button>-->
<!--                                            </el-row>-->

<!--                                        </el-card>-->

<!--                                    </el-col>-->
<!--                                </el-row>-->
<!--                            </el-tab-pane>-->

<!--                            <el-tab-pane  name="releasable">-->
<!--                                <span slot="label"><i class="el-icon-edit-outline"></i>待发布</span>-->
<!--                                <el-row>-->
<!--                                    <el-col :span="5" v-for="(news, index) in newsTableData" :key="index" :offset="index > 0 ? 1 : 0">-->
<!--                                        <el-card shadow="always" :body-style="{ padding: '0px' }">-->

<!--                                            &lt;!&ndash;主封面图 样式&ndash;&gt;-->
<!--                                            <el-image class="image" :src="serverUrl+news.coverUrl">-->
<!--                                                &lt;!&ndash;如果加载失败就用本地图片&ndash;&gt;-->
<!--                                                <div slot="error" class="image-slot" >-->
<!--                                                    <img class="image" src="../../../assets/images/main_cover.png">-->
<!--                                                </div>-->
<!--                                            </el-image>-->

<!--                                            <div style="padding: 10px;">-->
<!--                                                <el-row >-->
<!--                                                    <el-col :span="20">-->
<!--                                                        <div style="margin-bottom: 5px">{{news.title}}</div>-->
<!--                                                        <el-row>-->
<!--                                                            <el-col :span="12">-->
<!--                                                                <div style="color: gray;">阅读量{{news.readTimes}}</div>-->
<!--                                                            </el-col>-->
<!--                                                            <el-col :span="12">-->
<!--                                                                <div style="color: gray;text-align: right;margin-right: 10px">{{news.publishAt}}</div>-->
<!--                                                            </el-col>-->
<!--                                                        </el-row>-->
<!--                                                    </el-col>-->
<!--                                                    <el-col :span="4">-->
<!--                                                        <el-image style="width: 44px;height: 44px" :src="serverUrl+news.smallCoverUrl"></el-image>-->
<!--                                                    </el-col>-->
<!--                                                </el-row>-->
<!--                                            </div>-->
<!--                                            <el-row style="padding: 10px">-->
<!--                                                <el-button type="text" class="button" style="margin-left: 5px" @click="publish(news)">公开发布</el-button>-->
<!--                                                <el-button type="text" class="button" @click="goUpdateNews(news)">修改</el-button>-->
<!--                                                <el-button type="text" class="button" @click="goNewsDetailsPage(news)">详情</el-button>-->
<!--                                            </el-row>-->

<!--                                        </el-card>-->

<!--                                    </el-col>-->
<!--                                </el-row>-->
<!--                            </el-tab-pane>-->
<!--                        </el-tabs>-->
<!--                    </div>-->
<!--                </el-tab-pane>-->
<!--            </el-tabs>-->

    </div>

</template>

<script>
    export default {
        name:'news',
        data() {
            return {
                serverUrl:this.API.ServerUrl,
                demoMainCoverUrl:this.API.ServerUrl + "/public/news/main_cover.png",
                //激活态的tab标签名
                activeTabName:'articleManagement',

                //-------关于栏目设置的变量------------------
                searchForm: {
                    name: "",
                    status: ""
                },
                tableLoading: false,
                tableHeader: {
                    name: '栏目名称',
                    remark: '简要描述',
                    statusName: '状态'
                },
                tableData: [],

                addFormVisible: false,
                form: {
                    title: '',
                    uid: '',
                    name: '',
                    remark: ''
                },
                rules: {
                    name: [
                        {required: true, message: '栏目名称不能为空', trigger: 'blur'}
                    ],
                    remark: [
                        { max: 200, message: '长度在 200 个字符以内', trigger: 'blur' }
                    ]
                },

                pageSize: 10,
                currentPage: 1,
                total: 0,

                //-------关于栏目设置的变量 end--------------------



                //-------关于文章管理的变量 begin------------------
                currentDate: new Date(2020,1,10),
                activeNewsTabName:"allNews",

                searchNewsForm:{
                    title:'',
                    author:'',
                    status:'',
                    newsTypeUid:'',
                    whereShow:'',
                },

                newsTableLoading: false,
                newsTableHeader: {
                    title: '标题',
                    // author: '作者',
                    publishAt:'发布时间',
                    readTimes:'阅读量',
                    // newsTypeName: '栏目',
                    // tags:'标签',
                    // whereShowName:'位置',
                    // ShowOriginal:'显示原文',
                    // statusName:'状态',
                },
                newsTableData: [],
                newsTypeOptions:[],
                whereShowOptions:[
                    {name:'全部',value:null},
                    {name:'常规',value:0},
                    {name:'置顶',value:1},
                    {name:'轮播',value:2}
                ],
                newsStatusOptions:[
                    {name:'全部',value:null},
                    {name:'草稿',value:1},
                    {name:'审核中',value:2},
                    {name:'未通过',value:3},
                    {name:'待发布',value:4},
                    {name:'已发布',value:5}
                ],

                newsListPageSize:10,
                newsListCurrentPage:1,
                totalNews:0,
                //-------关于文章管理的变量 end--------------------



                //-------关于审核进度的变量 begin------------------
                activeQueryProgressTabName:"underReview",

                //-------关于审核进度的变量 end--------------------
            }
        },
        mounted() {
            // this.getData();
            this.getNewsType();
            this.queryNews();
        },
        methods: {

            /*
            * 第一级tab标签栏的点击事件触发
            * 也就是左侧做外层的纵向标签：栏目设置、文章管理、审核进度
            */
            handleLevelOneTabClick(tab, event){
                console.log(tab, event);
                this.newsTableData = {};
                let queryConditions = {};

                if(tab.name === 'newsTypeSetting'){
                    this.getData();
                }

                if(tab.name === 'articleManagement'){
                    queryConditions = {};
                    switch (this.activeNewsTabName) {
                        case "rotatingNews":
                            queryConditions.whereShow = 2;
                            this.getNewsList(queryConditions);
                            break
                        case "topNews":
                            queryConditions.whereShow = 1;
                            this.getNewsList(queryConditions);
                            break;
                        case "allNews":
                            // 将搜索表单作为条件去查询新闻
                            this.queryNews();
                            break;
                    }
                }

                if(tab.name === 'queryProgress'){
                    queryConditions = {};
                    switch (this.activeQueryProgressTabName) {
                        case "underReview":
                            queryConditions.status = 2;
                            break;
                        case "notApproved":
                            queryConditions.status = 3;
                            break;
                        case "releasable":
                            queryConditions.status = 4;
                            queryConditions.published = false;
                            break
                    }
                    this.getNewsList(queryConditions);
                }

            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData()
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData()
            },

            //显示弹窗表单
            showForm() {
                this.addFormVisible = true;
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.remark = '';
                this.addFormVisible = false
            },

            /*
            * 触发弹窗-增加新闻栏目
            */
            addData() {
                this.form.title = '添加栏目';
                this.form.uid = null;//为空时表示增加新闻栏目，uid由后端生成
                this.showForm();
            },

            /*
            * 触发弹窗-修改新闻栏目
            */
            updateData(item) {
                this.form.title = '修改栏目';
                this.form.uid = item.uid;
                this.form.name = item.name;
                this.form.remark = item.remark;
                this.showForm();
            },

            /*
            * 修改新闻栏目
            */
            confirmAddOrUpdate(formName) {
                let that = this;
                let httpRequestUrl = "/manager/news_type";

                let params = {
                    name: that.form.name,
                    remark: that.form.remark
                };
                if(that.form.uid){//表示更新
                    httpRequestUrl = "/manager/news_type/update";
                    params.uid = that.form.uid;
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$request.httpRequest({
                            method: 'post',
                            url: httpRequestUrl,
                            noLoading: true,
                            params: params,
                            success: data => {
                                this.$message({
                                    type: 'success',
                                    message: that.form.uid?'修改成功!':'添加成功!'
                                });
                                that.resetForm('form');
                                that.getData();
                            },
                            error: e => {
                                this.$message({
                                    type: 'warning',
                                    message: (that.form.uid?'修改失败! ':'添加失败! ')+e.message
                                });
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },

            /*
            * 删除新闻栏目
            */
            deleteData(row) {
                this.$confirm('确认删除该栏目吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'delete',
                        url: "/manager/news_type/"+row.uid,
                        noLoading: true,
                        params: { },
                        success: data => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getData();
                        },
                        error: e => {
                            this.$message({
                                type: 'warning',
                                message: '删除失败!'
                            });
                            this.getData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            /*
            * 获取新闻栏目的列表
            */

            getNewsType() {
                this.tableLoading = true;
                setTimeout(() => {
                    this.$request.httpRequest({
                        method: 'get',
                        url: "/manager/news_type",
                        noLoading: true,
                        params: {
                            status: 1,//所有启用中的新闻栏目
                            pageSize: 20,
                            property: 'sequence',
                            direction: 'asc'
                        },
                        success: data => {
                            let tyList = JSON.parse(JSON.stringify(data.content));
                            if(tyList){
                                tyList.unshift({name:'全部',uid:''});
                            }
                            this.newsTypeOptions = tyList;
                        },
                        error: e => {

                        }
                    })
                })
            },



            getData(event) {
                console.log(event)
                if(event){
                    this.currentPage = 1;
                }
                this.tableLoading = true;
                setTimeout(() => {
                    this.$request.httpRequest({
                        method: 'get',
                        url: "/manager/news_type",
                        noLoading: true,
                        params: {
                            // status: 1,
                            size: 30,
                            property: 'sequence',
                            direction: 'asc'
                        },
                        success: data => {
                            this.tableData = data.content;

                            let tyList = JSON.parse(JSON.stringify(data.content));
                            if(tyList){
                                tyList.unshift({name:'全部',uid:''});
                            }
                            this.newsTypeOptions = tyList;

                            this.total = data.totalElements;
                            this.tableLoading = false;
                        },
                        error: e => {
                            this.tableLoading = false
                        }
                    })
                })
            },

            /*
            * 改变新闻栏目的状态：启用 和 未用
            */
            changeStatus(row,status){
                this.$request.httpRequest({
                    method: 'put',
                    url: "/manager/news_type",
                    noLoading: true,
                    params: {
                        uid:row.uid,
                        name:row.name,
                        remark:row.remark,
                        status:status
                    },
                    success: data => {
                        console.log(data, data);
                        this.$message({
                            type: 'success',
                            message: status === 1 ? '启用成功!':'停用成功'
                        });
                        this.getData();
                    },
                    error: e => {
                        this.$message({
                            type: 'warning',
                            message: status === 1 ? '启用失败!':'停用失败'
                        });
                        this.getData();
                    }
                })
            },

            /*
            * 改变新闻栏目的顺序
            */
            changeSequence(row,direction){
                this.$request.httpRequest({
                    method: 'put',
                    url: "/manager/news_type/change_sequence",
                    noLoading: true,
                    params: {
                        uid:row.uid,
                        direction:direction
                    },
                    success: data => {
                        console.log(data, data);
                        this.$message({
                            type: 'success',
                            message: '修改排序成功!'
                        });
                        this.getData();
                    },
                    error: e => {
                        this.$message({
                            type: 'warning',
                            message: '修改排序失败!'
                        });
                        this.getData();
                    }
                })
            },

            //======新闻文章管理相关的方法 begin===========================================================================
            /*
            * 处理文章管理页面中顶部tab标签的点击事件
            * 轮播新闻  rotatingNews
            * 置顶新闻  topNews
            * 全部      allNews
            */
            handleTabsOfNewsManagementClick(tab, event){
                this.newsTableData = {};
                let queryConditions = {};

                if(tab.name === 'rotatingNews'){
                    this.activeNewsTabName ="rotatingNews";
                    queryConditions.whereShow = 2;
                    this.getNewsList(queryConditions);
                }

                if(tab.name === 'topNews'){
                    this.activeNewsTabName ="topNews";
                    queryConditions.whereShow = 1;
                    this.getNewsList(queryConditions);
                }

                if(tab.name === 'allNews'){
                    this.activeNewsTabName ="allNews";
                    // 将搜索表单作为条件去查询新闻
                    this.queryNews();
                }
            },

            searchNews(){
                let that = this;
                if( that.activeNewsTabName ==="allNews"){
                    // 将搜索表单作为条件去查询新闻
                    that.queryNews();
                }
            },

            /*
            * 处理审核进度页面中顶部tab标签的点击事件
            * 审核中  underReview
            * 未通过  notApproved
            * 待发布    releasable
            */
            handleTabsOfQueryProgressClick(tab, event){
                console.log(tab, event);

                this.newsTableData = {};
                let queryConditions = {};

                if(tab.name === 'underReview'){
                    queryConditions.status = 2;
                    this.getNewsList(queryConditions);
                }

                if(tab.name === 'notApproved'){
                    queryConditions.status = 3;
                    this.getNewsList(queryConditions);
                }

                if(tab.name === 'releasable'){
                    queryConditions.status = 4;
                    queryConditions.published = false;
                    this.getNewsList(queryConditions);
                }
            },

            /*
            * 处理新闻列表的页面大小和当前页变化
            * 并查询
            */
            handleNewsListCurrentPage(val) {
                this.newsListCurrentPage = val;
                this.queryNews();
            },
            handleNewsListPageSizeChange(val) {
                this.newsListPageSize = val;
                this.queryNews();
            },

            /*
            * 将搜索表单作为条件去查询新闻
            */
            queryNews(){
                let queryConditions = {};
                queryConditions = this.searchNewsForm;
                queryConditions.page =this.newsListCurrentPage;
                queryConditions.pageSize = this.newsListPageSize;
                this.getNewsList(queryConditions);
            },

            /*
            * 根据条件获取新闻列表
            */
            getNewsList(queryConditions){
                let that = this;
                // 按照发布时间降序
                queryConditions.property ='publishAt';
                queryConditions.direction = 'des';
                return new Promise((resolve, reject)=>{
                    that.newsTableLoading = true;
                    setTimeout(() => {
                        this.$request.httpRequest({
                            method: 'get',
                            url: "/manager/news",
                            noLoading: true,
                            params: queryConditions,
                            success: data => {
                                that.newsTableData = data.content;
                                that.totalNews = data.totalElements;
                                that.newsTableLoading = false;
                                resolve(data.content);
                            },
                            error: e => {
                                that.newsTableLoading = false;
                                reject(e);
                            }
                        })
                    })
                });
            },

            /*
            * 跳转到新闻编辑页面
            */
            goAddNewsPage(){
                console.log("转向新闻编辑页面");
                this.$router.push({
                    path:'/basic_info/editNews',
                    query:{
                        operation:'add'
                    }
                });
            },


            /*
            * 删除新闻
            */
            deleteNews(news){
                this.$confirm('确认删除该新闻吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'delete',
                        url: "/manager/news/"+news.uid,
                        noLoading: true,
                        params: { },
                        success: data => {
                            this.queryNews();
                            this.$message({
                                type: 'success',
                                message: data.message
                            });

                        },
                        error: e => {
                            this.queryNews();
                            this.$message({
                                type: 'warning',
                                message: e.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            /*
            * 修改新闻
            */
            goUpdateNews(news){
                this.$router.push({
                    path:'/basic_info/editNews',
                    query:{
                        operation:'update',
                        uid:news.uid
                    }
                });
            },

            /*
            * 查看新闻详情
            */
            goNewsDetailsPage(news){
                this.$router.push({
                    path:'/basic_info/editNews',
                    query:{
                        operation:'read',
                        uid:news.uid
                    }
                });
            },

            /*
            * 提交审核
            */
            toReview(news){
                this.$confirm('确认将该新闻提交至审核吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'post',
                        url: "/manager/news/to_review/"+news.uid,
                        noLoading: true,
                        params: { },
                        success: data => {
                            this.queryNews();
                            console.log("提交成功返回的信息：");
                            console.log(data);
                            this.$message({
                                type: 'success',
                                message: data.message
                            });

                        },
                        error: e => {
                            this.queryNews();
                            this.$message({
                                type: 'warning',
                                message: e.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交审核'
                    });
                });
            },
            //======新闻文章管理相关的方法 end=============================================================================

            /*
            * 发布新闻
            */
            publish(news){
                this.$confirm('确认发布该新闻吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'post',
                        url: "/manager/news/publish",
                        noLoading: true,
                        params: {uid:news.uid },
                        success: data => {

                            if(this.activeNewsTabName === 'allNews'){
                                this.queryNews();
                            }

                            if(this.activeQueryProgressTabName === 'releasable'){
                                let queryConditions ={};
                                queryConditions.status = 4;
                                queryConditions.published = false;
                                this.getNewsList(queryConditions);
                            }

                            this.$message({
                                type: 'success',
                                message: data.message
                            });

                        },
                        error: e => {
                            this.$message({
                                type: 'warning',
                                message: e.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发布'
                    });
                });
            },

            setPriority(news,whereShow){
                this.$confirm('确认修改该新闻展示位置吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'post',
                        url: "/manager/news/priority",
                        noLoading: true,
                        params: {
                            uid:news.uid,
                            whereShow:whereShow
                        },
                        success: data => {

                            this.newsTableData = {};
                            let queryConditions = {};

                            if(this.activeNewsTabName === 'rotatingNews'){
                                queryConditions.whereShow = 2;
                                this.getNewsList(queryConditions);
                            }

                            if(this.activeNewsTabName === 'topNews'){
                                queryConditions.whereShow = 1;
                                this.getNewsList(queryConditions);
                            }

                            if(this.activeNewsTabName === 'allNews'){
                                // 将搜索表单作为条件去查询新闻
                                this.queryNews();
                            }
                            this.$message({
                                type: 'success',
                                message: data.message
                            });

                        },
                        error: e => {
                            this.$message({
                                type: 'warning',
                                message: e.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消设置'
                    });
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@/styles/table/table';

    /*关于栏目设置*/

    .table-demo {
        padding-top: 0;
        padding-left: 10px;
        padding-right: 25px;
    }

    .searchBar {
        /*margin: 10px 5px;*/
        margin-top: 10px;
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
    /*关于栏目设置 end*/

    /*关于文章管理*/
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .cover-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 56px;
        line-height: 56px;
        text-align: center;
        border-top: 1px dashed #d9d9d9;
    }

    .small-cover-icon {
        font-size: 44px;
        color: #8c939d;
        width: 100%;
        height: 100%;
        line-height: 100%;
        text-align: center;
    }

    /*关于文章管理 end*/
</style>
