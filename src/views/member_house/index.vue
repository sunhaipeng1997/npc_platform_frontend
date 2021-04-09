<template>
	<div class="cardZone">
		<el-row :gutter="20">
			<el-col :span="8"
			        v-for="(item,index) in overview"
			        style="margin-bottom: 20px;">
				<el-card shadow>
					<el-row>
						<el-col :span="8"
						        class="overviewZone"><p class="overview-label">{{item.name}}</p></el-col>
						<el-col :span="16"
						        class="overviewZone"><p class="overview-content"><span>{{item.count}}</span>条</p></el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="12"
			        style="margin-bottom: 20px;">
				<el-card shadow>
					<div class="chart"
					     id="opinion"
					     ref="opinion"></div>
				</el-card>
			</el-col>
			<el-col :span="12"
			        style="margin-bottom: 20px;">
				<el-card shadow>
					<div class="chart"
					     id="suggestion"
					     ref="suggestion"></div>
				</el-card>
			</el-col>
			<el-col :span="12"
			        style="margin-bottom: 20px;">
				<el-card shadow>
					<div class="chart"
					     id="performance"
					     ref="performance"></div>
				</el-card>
			</el-col>
			<el-col :span="12"
			        style="margin-bottom: 20px;">
				<el-card shadow>
					<div class="chart"
					     id="performanceType"
					     ref="performanceType"></div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import echarts from 'echarts';

	export default {
		name: "index",
		data() {
			return {
				overview: [
					{
						name: '今日意见提交',
						count: 2323,
					},
					{
						name: '今日建议提交',
						count: 23213,
					},
					{
						name: '今日履职提交',
						count: 432,
					}], /*
				 opinion: {
				 title: {
				 text: "代表意见统计"
				 },
				 itemStyle: {
				 color: "#0288D1"
				 },
				 tooltip: {},
				 xAxis: {
				 data: [
				 "一月",
				 "二月",
				 "三月",
				 "四月",
				 "五月",
				 "六月",]
				 },
				 yAxis: {},
				 series: [
				 {
				 name: "数量",
				 type: "line",
				 data: [
				 1,
				 20,
				 36,
				 10,
				 10,
				 20,
				 36,
				 10,
				 10,
				 20,
				 36,
				 20]
				 }]

				 },
				 */
				suggestion: {
					title: {
						text: "代表建议统计"
					},
					itemStyle: {
						color: "#D84315"
					},
					tooltip: {},
					xAxis: {
						data: [
							"一月",
							"二月",
							"三月",
							"四月",
							"五月",
							"六月",
							"七月",
							"八月",
							"九月",
							"十月",
							"十一月",
							"十二月"]

					},
					yAxis: {},
					series: [
						{
							name: "数量",
							type: "line",
							data: [
								5,
								20,
								36,
								10,
								10,
								20,
								36,
								10,
								10,
								20,
								36,
								20]
						}]

				},
				performance: {
					title: {
						text: "代表履职统计"
					},
					itemStyle: {
						color: "#304FFE"
					},
					tooltip: {},
					xAxis: {
						data: [
							"一月",
							"二月",
							"三月",
							"四月",
							"五月",
							"六月",
							"七月",
							"八月",
							"九月",
							"十月",
							"十一月",
							"十二月"]
					},
					yAxis: {},
					series: [
						{
							name: "数量",
							type: "line",
							data: [
								5,
								20,
								36,
								10,
								10,
								20,
								36,
								10,
								10,
								20,
								36,
								20]
						}]
				},
				performanceType: {
					title: {
						text: "履职类型统计"
					},
					itemStyle: {
						color: "#2979FF"
					},
					tooltip: {},
					xAxis: {
						data: [
							"人大会议",
							"集中学习",
							"视察调研",
							"代表培训",]
					},
					yAxis: {},
					series: [
						{
							name: "数量",
							type: "bar",
							data: [
								5,
								20,
								36,
								20]
						}]
				},

			};
		},
		methods: {

			// 今日新增
			setTodayNumber() {
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/member_house/homepage/getTodayNumber",
						noLoading: true,
						params: {

							page: this.currentPage,
							size: this.pageSize,
							property: 'createTime',
							direction: 'desc'
						},
						success: data => {
							let key = Object.keys(data);
							for (let i = 0; i < key.length; i++) {
								this.overview[i].count = data[key[i]];
							}
						},
						error: e => {
							this.tableLoading = false;

						}
					});
				});
			},

			// 本月意见
			setOpinion() {
				let that = this;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/member_house/homepage/drawOpinion",
						noLoading: true,
						params: {

							page: this.currentPage,
							size: this.pageSize,
							property: 'createTime',
							direction: 'desc'
						},
						success: data => {
							this.loadCharts(data.xaxis, data.yaxis,'opinion','line','代表意见',1);
						},
						error: e => {
						}
					});
				});

			},

			// 本月建议
			setSuggestion() {
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/member_house/homepage/drawSuggestion",
						noLoading: true,
						params: {

							page: this.currentPage,
							size: this.pageSize,
							property: 'createTime',
							direction: 'desc'
						},
						success: data => {
							this.loadCharts(data.xaxis, data.yaxis,'suggestion','line','代表建议',1);
						},
						error: e => {

						}
					});
				});

			},

			// 本月履职
			setPerformance() {
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/member_house/homepage/drawPerformance",
						noLoading: true,
						params: {

							page: this.currentPage,
							size: this.pageSize,
							property: 'createTime',
							direction: 'desc'
						},
						success: data => {
							this.loadCharts(data.xaxis, data.yaxis,'performance','line','代表履职',1);

						},
						error: e => {

						}
					});
				});

			},

			// 履职类型
			setPerformanceType() {
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/member_house/homepage/drawPerformanceType",
						noLoading: true,
						params: {

							page: this.currentPage,
							size: this.pageSize,
							property: 'createTime',
							direction: 'desc'
						},
						success: data => {
							this.loadCharts(data.xaxis, data.yaxis,'performanceType','bar','履职类型',0);

						},
						error: e => {
							this.tableLoading = false;
						}
					});
				});

			},

			// 请求图表数据
			getCharts() {
				this.setTodayNumber();

				this.setOpinion();
				this.setSuggestion();
				this.setPerformance();
				this.setPerformanceType();
			},

			// 装载图表数据
			loadCharts(xArr, yArr, id, type,text,showx) {
				let chartOpinion = echarts.init(document.getElementById(id));
				chartOpinion.setOption({
					title: {
						text: text
					},
					itemStyle: {
						color: "#0288D1"
					},
					tooltip: {},
					xAxis: {
						data: xArr,
						axisLabel: {
							interval: showx
						}
					},
					yAxis: {},
					series: [
						{
							name: "数量",
							type: type,
							data: yArr
						}]

				});
			}
		},
		mounted() {
			this.getCharts();
			// this.loadCharts();
		}
	};
</script>

<style scoped>
	.overviewZone {
		height : 40px;
	}

	.overview-label {
		font-size   : 24px;
		line-height : 40px;
		margin      : 0;
	}

	.overview-content {
		text-align  : center;
		font-size   : 20px;
		line-height : 40px;
		margin      : 0;
	}

	.overview-content > span {
		color     : #1482f0;
		font-size : 36px;
	}

	.cardZone {
		padding : 25px;
	}

	.chart {
		width  : 100%;
		height : 300px;
	}
</style>
