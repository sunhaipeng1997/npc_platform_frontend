<template>
	<div :class="{'has-logo':showLogo}">
		<logo v-if="showLogo"
		      :collapse="isCollapse" />
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<el-menu
					:default-active="activeMenu"
					:collapse="isCollapse"
					:background-color="variables.menuBg"
					:text-color="variables.menuText"
					:unique-opened="false"
					:active-text-color="variables.menuActiveText"
					:collapse-transition="false"
					mode="vertical"
			>
				<sidebar-item v-for="route in menuItems"
				              :key="route.path"
				              :item="route"
				              :base-path="route.path" />
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex';
	import Logo from './Logo';
	import SidebarItem from './SidebarItem';
	import variables from '@/styles/variables.scss';

	export default {
		components: {
			SidebarItem,
			Logo
		},
		data() {
			return {
				systemUid: '',
				menus: [],
				menuItems: [],
				testMenus:[{
					path:'path1',

				}]
			};
		},

		computed: {
			...mapGetters([
				'sidebar']),
			routes() {
				return this.$store.state.permission.routes[7].children;
			},
			activeMenu() {
				const route = this.$route;
				const {meta, path} = route;
				// if set path, the sidebar will highlight the path you set
				if (meta.activeMenu) {
					return meta.activeMenu;
				}
				return path;
			},
			showLogo() {
				return this.$store.state.settings.sidebarLogo;
			},
			variables() {
				return variables;
			},
			isCollapse() {
				return !this.sidebar.opened;
			}
		},
		created() {
			this.systemUid = localStorage.getItem('system');
			let menuItems = localStorage.getItem('menus');
			if (!menuItems) {
				this.getSysMenus();
				// 本地开发切换8081需要用
			}else{
				this.menuItems = JSON.parse(menuItems);
				this.loadMenuItem();
			}
		},
		methods: {
			// 获取菜单列表
			getSysMenus() {
				{
					setTimeout(() => {
						this.$request.httpRequest({
							method: 'get',
							url: "/manager/auth/menus",
							noLoading: true,
							params: {
								uid: this.systemUid,
							},
							success: res => {
								this.menus = res;
								this.loadMenuItem();
							},
							error: e => {
								this.$message({
									type: 'warning',
									message: '查询失败!'
								});

							}
						});
					});
				}
			},

			// 组装菜单项
			loadMenuItem() {
				this.menus.forEach(menu => {//接口返回的菜单列表
					let localRoutes = this.$store.state.permission.routes;
					localRoutes.forEach(item => {//本地路由列表
						if (item.children) {
							item.children.forEach(route => {//每一个路由对象
								if (route.name == menu.route) {
									if (menu.children.length > 0){
										route.children = this.getChildren(menu);//获取这个菜单所有的子菜单
									}
									this.menuItems.push(route);
								}
							})
						}
					});
				});
				localStorage.setItem("menus",JSON.stringify(this.menuItems));
			},
			getChildren(menus) {
				let children = [];
				let localRoutes = this.$store.state.permission.routes;
				menus.children.forEach(menu => {//需要获取子菜单的父级菜单
					localRoutes.forEach(item => {//本地路由列表
						if (item.children) {
							item.children.forEach(route => {//每一个路由对象
								if (route.name == menu.route) {
									children.push(route);
								}
							})
						}
					});
				});
				return children;
			}
		}
	};
</script>
