<template>

  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" width="64px">
        <span>麻雀生鲜后台管理系统</span>
      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>

      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <el-menu
          background-color="#333744" text-color="#fff" active-text-color="#409eef"
          :unique-opened="true" :collapse="isCollapse" :collapse-transition="false"
          :router="true" :default-active="activePath">

            <!--    二级菜单        -->
            <el-menu-item :index="'/' + item.path" @click="saveNavState('/'+item.path)"
                          v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconsObject[item.id]"></i>
                <span>{{item.pathname}}</span>
              </template>
            </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <!-- 路由占位符-->
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>

</template>

<script>
  export default {
    data () {
      return {
        menuList: [
          {
            id: 1,
            path: 'order',
            pathname: "订单管理"
          },
          {
            id: 2,
            path: 'addFresh',
            pathname: "添加生鲜"
          },
          {
            id: 3,
            path: 'editFresh',
            pathname: "生鲜管理"
          },
          {
            id: 4,
            path: 'shopInfo',
            pathname: "本店信息"
          },
        ],
        iconsObject: {
          '1': 'el-icon-s-order',
          '2': 'el-icon-circle-plus',
          '3': 'el-icon-s-goods',
          '4': 'el-icon-info'
        },
        // 是否折叠
        isCollapse: false,
        // 激活的菜单选项
        activePath: '/order'
      }
    },
    created () {
      this.setActivePath()

      this.isAdmin()
    },
    methods: {
      isAdmin() {
        const me = JSON.parse(window.sessionStorage.getItem("me"))

        if (me.phone === "admin") {
          this.menuList = [
            {
              id: 1,
              path: 'shopApplyList',
              pathname: "商铺审核"
            },
            {
              id: 2,
              path: 'shopList',
              pathname: "商铺管理"
            }
          ]

          this.iconsObject ={
            '1': 'el-icon-s-order',
            '2': 'el-icon-s-shop'
          }
        }
      },
      setActivePath() {
        const activePath = window.sessionStorage.getItem('activePath')

        if (activePath) {
          this.activePath = activePath
        }
      },
      async logout () {
        // await this.$http.get('/logout')

        window.sessionStorage.clear()

        await this.$router.push('/login')
      },
      // 菜单折叠与展开事件
      toggleCollapse () {
        this.isCollapse = !this.isCollapse
      },
      // 保存菜单选择的激活状态
      saveNavState (activePath) {
        window.sessionStorage.setItem('activePath', activePath)

        this.activePath = activePath
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: white;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    // 去掉二级菜单选项的外边框溢出
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: white;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

</style>
