<template>
	<div class="content-bg">
		<div class="content">
			<!--<div class="titleName"><h1>人大智慧平台</h1></div>-->
			<div>
				<div style="width: 10%;display: inline-block">&nbsp;</div>
				<div class="home-title"
				     style="width: 80%;display: inline-block">
					<img src="../../assets/images/homeTitle.png"
					     alt="">
				</div>
				<div style="width: 10%;display: inline-block">
					<svg-icon style="color: #FFFFFF;width: 40px;height: 40px;position: relative;top: -74px; z-index:10"
					          icon-class="exit"
					          @click="logout"></svg-icon>
				</div>

			</div>
			<!--subsys-->
			<div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide"
					     @click="jumpToSystem(item)"
					     v-for="(item,index) in systemList"
					     :key="index">

						<svg-icon class="slider-icon"
						          :icon-class="item.svg" />
						<p class="slider-p">{{item.name}}</p>
						<!--<div class="slider-div">
							<p>{{item.desc}}</p>
						</div>-->
					</div>
				</div>
			</div>
			<footer>
				<p>成都科鸿达科技有限公司 Present</p>
			</footer>
		</div>

	</div>
</template>


<script>
	import Swiper from 'swiper';
	import 'swiper/css/swiper.css';

	export default {
		name: 'Guide',
		data() {
			return {
				systemList: [
					{
						id: '1',
						name: '基本信息管理',
						url: "memberHouse",
						svg: "home",
						uid: '123213213123',
						desc: '新闻发布与管理, 选民信息管理, 各代表意见查看与管理',
					},
					{
						id: '1',
						name: '代表之家管理系统',
						url: "memberHouse",
						svg: "home",
						uid: '123213213123',
						desc: '新闻发布与管理, 选民信息管理, 各代表意见查看与管理',
					},
					{
						id: '2',
						name: '代表建议办理系统',
						url: "bbb",
						svg: "handle",
						desc: '这里可以办理代表的建议, 还可以办理代表的建议',
					},
					{
						id: '3',
						name: '代表履职登记系统',
						url: "ccc",
						svg: "duty",
						desc: '履职履职履职履职, 还有就是登记登记登记',
					},
					{
						id: '4',
						name: '投票系统',
						url: "ddd",
						svg: "vote",
						desc: '顾名思义, 就是投票',
					},
					{
						id: '4',
						name: '投票系统',
						url: "ddd",
						svg: "register",
						desc: '顾名思义, 就是投票',
					},
					{
						id: '4',
						name: '投票系统',
						url: "ddd",
						svg: "success-fill",
						desc: '顾名思义, 就是投票',
					},
					{
						id: '4',
						name: '投票系统',
						url: "ddd",
						svg: "success-fill",
						desc: '顾名思义, 就是投票',
					},
					{
						id: '4',
						name: '投票系统',
						url: "ddd",
						svg: "success-fill",
						desc: '顾名思义, 就是投票',
					},
					{
						id: '4',
						name: '投票系统',
						url: "ddd",
						svg: "success-fill",
						desc: '顾名思义, 就是投票',
					},
					{
						id: '4',
						name: '投票系统',
						url: "ddd",
						svg: "success-fill",
						desc: '顾名思义, 就是投票',
					},
					{
						id: '4',
						name: '投票系统',
						url: "ddd",
						svg: "success-fill",
						desc: '顾名思义, 就是投票',
					},
					{
						id: '4',
						name: '投票系统',
						url: "ddd",
						svg: "success-fill",
						desc: '顾名思义, 就是投票',
					},
				],
				loading: false,
			};
		},
		mounted() {
			this.initSwiper();
		},

		created() {
			this.getSystem()
		},

		methods: {
			getSystem() {
				this.$request.httpRequest({
					method: 'get',
					url: this.API.SystemData,
					returnFullData: true,
					noLoading: true,
					hideErrorMsg: true,
					success: (data) => {
						this.systemList = data.data;
					},
					error: (e) => {
						this.loading = false;
						const errorMsg = e.hasOwnProperty('resultMessage') ? e.resultMessage : '获取系统失败';
						this.$message({
							message: errorMsg,
							type: 'error',
							customClass: 'errorloginwidth',
							duration: 500,
						});
					},
				});
			},
			jumpToSystem(item) {
				// localStorage.setItem("system", item.uid);
				// this.$router.push({name: item.url});
				let params = {
				    'systemId': item.uid,
				};
				this.$request.httpRequest({
				    method: 'post',
				    url: '/manager/system/cacheSystem',
				    returnFullData: false,
				    noLoading: true,
				    hideErrorMsg: true,
				    params:params,
				    success: (data) => {
				    	if(item.canUse===false){
				    		this.$message({
							    message: '您没有权限',
							    type: 'error',
							    duration: 2000
						    })
						    return
					    }
						localStorage.setItem("system", item.uid);
						localStorage.setItem("system_name", item.name);
						this.$router.push({name: item.url});
					}, error: (e) => {
				        this.loading = false;
				        const errorMsg = '进入系统失败';
				        this.$message({
				            message: errorMsg,
				            type: 'error',
				            customClass: 'errorloginwidth',
				            duration: 500
				        })
				    }
				})
			}, // 初始化swiper
			initSwiper() {
				var mySwiper = new Swiper('.swiper-container', {
					slidesPerView: 3,//一行显示3个
					slidesPerColumn: 2,//显示2行
					spaceBetween: 40,
					mousewhell: true, // 如果需要滚动条
					// scrollbar: {
					//     el: '.swiper-scrollbar'
					// },
				});
			},
			async logout() {
				await this.$store.dispatch('LogOut');
				await this.$store.dispatch('tagsView/delAllViews');
				this.$router.push('/login')
			},
		},
	};
</script>
<style lang="scss"
       scoped>
	@import "~@/styles/mixin";

	.content-bg {
		width: 100%;
		height: 100%;
		text-align: center;
		background: url("../../assets/images/homeBG2.jpg") no-repeat;
		background-size: 100% 100%;
	}

	.content {
		height: 100%;
		/*width: 100%;*/
		/*background-color: rgba(0, 176, 255, 0.5);*/
		text-align: center;
	}

	.titleName {
		width: 500px;
		height: 50px;
		font-size: 36px;
		font-family: "幼圆", "Microsoft YaHei", serif;
		color: #fff;
		position: absolute;
		left: 37%;
		text-shadow: 10px 10px 12px #666;
	}

	.container {
		margin: 0 auto;
		padding-top: 300px;
		padding-right: 20px;
		height: 600px;
		width: 80%;
		display: flex;
		flex-wrap: wrap;
		overflow-x: scroll;
		overflow-y: hidden;
		flex-direction: row;
		/*justify-content: center;*/
		align-items: center;
		align-content: center;

	}

	.system {
		font-size: 30px;
		font-weight: 900;
		color: #fff;
		height: 200px;
		width: 420px;
		margin: 15px;
		white-space: nowrap;
		border-radius: 5px;
		line-height: 200px;
		text-align: center;
		background-color: rgba(41, 121, 255, 0.6);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		/*text-shadow:10px 10px 12px #666;*/

		transition: height 0.5s, width 0.5s;
		-moz-transition: height 0.5s, width 0.5s; /* Firefox 4 */
		-webkit-transition: height 0.5s, width 0.5s; /* Safari and Chrome */
		-o-transition: height 0.5s, width 0.5s; /* Opera */
	}

	/*.system:hover {
		height: 220px;
		width: 440px;
	}*/

	.swiper-container {
		width: 100%;
		height: 780px;
		margin-left: auto;
		min-width: 1200px;
		max-width: 2400px;
		margin-right: auto;
		padding: 300px 80px 0;
		margin-top: -200px;
	}

	$swiper-max-width: 100px;
	.swiper-wrapper {
		max-width: $swiper-max-width;
	}

	.swiper-slide {
		text-align: left;
		font-family: "Microsoft YaHei UI Light";
		background: #fff;
		height: 200px;
		/* Center slidse text vertically */
		display: flex;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		-webkit-justify-content: center;
		justify-content: left;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;


		white-space: nowrap;
		font-size: 30px;
		font-weight: 900;
		flex-wrap: wrap;
		color: rgba(0, 0, 0, 0.88);
		border-radius: 6px;

		background-color: rgba(255, 255, 255, 1);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.16);
		text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
		transition: font-size 0.5s, box-shadow 0.5s, text-shadow 0.5s, color 0.5s;
		-moz-transition: font-size 0.5s, box-shadow 0.5s, text-shadow 0.5s;
		-webkit-transition: font-size 0.5s, box-shadow 0.5s, text-shadow 0.5s, color 0.5s;
		-o-transition: font-size 0.5s, box-shadow 0.5s, text-shadow 0.5s;
	}

	.slider-icon {
		margin-left: 30px;
		font-size: 1.2em;
	}

	.slider-p {
		margin: 0;
		font-size: 1.3em;
	}

	.slider-div {
		width: 100%;
		font-size: 18px;
		white-space: normal;
		line-height: 20px;
		height: 40px;
		margin-right: 10px;
	}

	.slider-div p {
		margin-left: 34px;
		margin-top: -30px;
		color: rgba(0, 0, 0, 0.88);
	}


	.swiper-slide:hover {
		/*color: #409EFF;*/
		font-size: 32px;
		box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.3);
		text-shadow: 5px 10px 10px rgba(0, 0, 0, 0.3);

	}

	.home-title {
		padding-top: 30px;
	}

	footer {
		width: 100%;
		position: absolute;
		bottom: 20px;
		text-align: center;
		margin: 0 auto;

	}

	footer > p {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.45);
		text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
	}
</style>
