<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商铺审核</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图  -->
    <el-card>
      <!--   搜索与添加区域   -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入商铺名称"
                    v-model="queryInfo.name" clearable @clear="getShopList">
            <el-button slot="append" icon="el-icon-search" @click="getShopList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--   数据表格区   -->
      <el-table :data="shopList" border stripe>
        <el-table-column label="店名" prop="name"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="负责人" prop="shopKeeper"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{new Date(scope.row["createdAt"]).toLocaleString()}}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updatedAt">
          <template slot-scope="scope">
            <span>{{new Date(scope.row["updatedAt"]).toLocaleString()}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80px"></el-table-column>

        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <el-button type="info" size="mini"
                       @click="openApplyInfo(scope.row)">查 看
            </el-button>
            <el-button type="warning" size="mini" v-if="scope.row.status === '营业'"
                       @click="openStopDialog(scope.row)">停 业
            </el-button>
            <el-button type="success" size="mini" v-else
                       @click="openRecoverDialog(scope.row)">恢 复
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--   分页区域   -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[3, 5, 10, 20, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </el-card>

    <!--  商铺信息对话框  -->
    <el-dialog class="my-el-dialog"
               title="商铺详情" width="600px"
               :visible.sync="shopDialogVisible"
               @close="shopDialogVisible = false">
      <el-row>
        <el-col :span="3">
          <div>店名:</div>
        </el-col>
        <el-col :span="9">
          <div>{{shop.name}}</div>
        </el-col>
        <el-col :span="3">
          <div>负责人:</div>
        </el-col>
        <el-col :span="9">
          <div>{{shop.shopKeeper}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div>联系电话:</div>
        </el-col>
        <el-col :span="9">
          <div>{{shop.phone}}</div>
        </el-col>
        <el-col :span="3">
          <div>状态:</div>
        </el-col>
        <el-col :span="9">
          <div>{{shop.status}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div>创建时间:</div>
        </el-col>
        <el-col :span="9">
          <div>{{new Date(shop.createdAt).toLocaleString()}}</div>
        </el-col>
        <el-col :span="3">
          <div>更新时间:</div>
        </el-col>
        <el-col :span="9">
          <div>{{new Date(shop.updatedAt).toLocaleString()}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div>描述:</div>
        </el-col>
        <el-col :span="20">
          <div>{{shop.description}}</div>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="shopDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!--  是否恢复 -->
    <el-dialog title="提示" width="30%"
               :visible.sync="recoverConfirmVisible">
      <span>是否恢复营业</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recoverConfirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRecover">确 认</el-button>
      </span>
    </el-dialog>

    <!--  是否停业  -->
    <el-dialog title="提示" width="30%"
               :visible.sync="stopConfirmVisible">
      <span>是否强制停业</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stopConfirmVisible = false">取 消</el-button>
        <el-button type="danger" @click="confirmStop">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 获取商铺列表的参数对象
        queryInfo: {
          name: '',
          status: '非审核中',
          // 当前页码
          pageNum: 1,
          pageSize: 3
        },
        shopList: [],
        totalPage: 0,

        // 商铺信息窗口
        shopDialogVisible: false,
        shop: {},

        // 提示窗口
        recoverConfirmVisible: false,
        stopConfirmVisible: false,
      }
    },
    created() {
      this.getShopList()
    },
    methods: {
      // 获取店铺列表
      getShopList() {
        this.$http.get("shopList", {
          params: this.queryInfo
        }).then(res => {
          this.shopList = res.data["data"]

          // 记录总条数
          this.totalPage = res.data["totalCounts"]
        }, () => {
          return this.$message.error('获取商铺列表失败')
        })
      },
      // pageSize 改变事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize

        this.getShopList()
      },
      // 页码值的改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage

        this.getShopList()
      },
      // 打开审核窗口
      openApplyInfo(shop) {
        this.shopDialogVisible = true

        this.shop = shop
      },
      // 打开确认窗口
      openRecoverDialog(shop) {
        this.shop = shop

        this.recoverConfirmVisible = true
      },
      // 不通过
      openStopDialog(shop) {
        this.shop = shop

        this.stopConfirmVisible = true
      },
      // 恢复营业
      confirmRecover() {
        this.shop.status = "营业"

        this.$http.patch(`shop`, {
          ...this.shop
        }).then(() => {
          this.$message.success('操作成功')

          this.recoverConfirmVisible = false

          this.getShopList()
        }, () => {
          this.$message.error('更新失败')
        })
      },
      // 确认停业
      confirmStop() {
        this.shop.status = "停业"

        this.$http.patch(`shop`, {
          ...this.shop
        }).then(() => {
          this.$message.success('操作成功')

          this.stopConfirmVisible = false

          this.getShopList()
        }, () => {
          this.$message.error('更新失败')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }
</style>
