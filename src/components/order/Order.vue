<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图  -->
    <el-card>
      <!--   搜索与添加区域   -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入订单号"
                    v-model="queryInfo.orderId" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--   数据表格区   -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="订单号" prop="id"></el-table-column>
        <el-table-column label="订单总价">
          <template slot-scope="scope">
            <span>{{scope.row["totalMoney"] / 100}}</span>
          </template>
        </el-table-column>
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
                       @click="showOrder(scope.row.id)">查看
            </el-button>
            <el-button type="primary" size="mini" v-if="scope.row.status === '待配送'"
                       @click="delivery(scope.row)">配送
            </el-button>
            <el-button type="warning" size="mini" v-else-if="scope.row.status === '退款中'"
                       @click="refund(scope.row)">退款
            </el-button>
            <el-button type="success" size="mini" v-else-if="scope.row.status === '配送中'"
                       @click="finish(scope.row)">送达
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--   分页区域   -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </el-card>


    <!--  订单详情的对话框  -->
    <el-dialog class="my-el-dialog"
               title="订单详情" width="600px"
               :visible.sync="orderDialogVisible"
               @close="orderDialogVisible = false">

      <div id="printOrder">
        <!--   配送信息   -->
        <el-row class="title-up">
          <el-col>
            <div>配送信息</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div>联系人:</div>
          </el-col>
          <el-col :span="9">
            <div>{{orderInfo.address.name}}</div>
          </el-col>
          <el-col :span="3">
            <div>手机号:</div>
          </el-col>
          <el-col :span="9">
            <div>{{orderInfo.address.phone}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div>详细地址:</div>
          </el-col>
          <el-col :span="20">
            <div>{{orderInfo.address.detail}}</div>
          </el-col>
        </el-row>

        <!-- 生鲜列表 -->
        <el-row class="title-middle">
          <el-col>
            <div>生鲜列表</div>
          </el-col>
        </el-row>
        <el-row>
          <el-table :data="orderInfo.freshList" style="width: 100%">
            <el-table-column prop="name" label="名称" width="150"/>
            <el-table-column prop="price" label="价格" width="100"/>
            <el-table-column prop="count" label="数量" width="100"/>
            <el-table-column prop="description" label="描述"/>
          </el-table>
        </el-row>


        <!-- 订单信息 -->
        <el-row class="title-down">
          <el-col>
            <div>订单信息</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div>订单号:</div>
          </el-col>
          <el-col :span="21">
            <div>{{orderInfo.id}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div>状 态:</div>
          </el-col>
          <el-col :span="9">
            <div>{{orderInfo.status}}</div>
          </el-col>

          <el-col :span="3">
            <div>实 付:</div>
          </el-col>
          <el-col :span="9">
            <div>￥ {{orderInfo.totalMoney / 100}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div>创建时间:</div>
          </el-col>
          <el-col :span="20">
            <div>{{new Date(orderInfo.createdAt).toLocaleString()}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div>更新时间:</div>
          </el-col>
          <el-col :span="20">
            <div>{{new Date(orderInfo.updatedAt).toLocaleString()}}</div>
          </el-col>
        </el-row>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!--  是否打印提示框  -->
    <el-dialog title="提示" width="30%"
               :visible.sync="printDialogVisible"
               :before-close="updateOrderStatus">
      <span>是否需要打印订单信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelPrint">取 消</el-button>
        <el-button type="primary" @click="confirmPrint">确 定</el-button>
      </span>
    </el-dialog>

    <!--  是否退款提示框  -->
    <el-dialog title="提示" width="30%"
               :visible.sync="refundDialogVisible">
      <span>是否退款</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRefund">拒 绝</el-button>
        <el-button type="primary" @click="confirmRefund">退 款</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 获取订单列表的参数对象
        queryInfo: {
          orderId: '',
          // 当前页码
          pageNum: 1,
          pageSize: 5
        },
        orderList: [],
        totalPage: 0,

        // 用户对话框的显示值
        editDialogVisible: false,
        editForm: {},

        freshStatusList: ["在线", "下架"],
        freshTypeList: [],

        // 查看订单按钮相关
        orderDialogVisible: false,
        orderInfo: {
          address: {},
          freshList: [],
          createdAt: 0,
          updatedAt: 0,
          totalMoney: 0,
          status: "",
          id: 0
        },

        // 打印提示框
        printDialogVisible: false,
        // 更新状态用
        order: {},

        // 退款提示框
        refundDialogVisible: false,
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      async getOrderList() {
        const res = await this.$http.get("orderList", {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取订单列表失败')
        }

        this.orderList = res.data["data"]

        // 记录总条数
        this.totalPage = res.data["totalCounts"]
      },
      // pageSize 改变事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize

        this.getOrderList()
      },
      // 页码值的改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage

        this.getOrderList()
      },
      // 展示订单详情页面
      async showOrder(orderId) {
        const res = await this.$http.get(`order/${orderId}`)

        if (res.status !== 200) {
          return this.$message.error('查询生鲜失败')
        }

        this.orderInfo = res.data["data"]

        this.orderDialogVisible = true
      },
      // 配送
      delivery(order) {
        this.printDialogVisible = true

        order.status = "配送中"

        this.order = order
      },
      // 取消打印订单
      cancelPrint() {
        this.printDialogVisible = false

        this.updateOrderStatus()
      },
      // 确认打印订单
      async confirmPrint() {
        this.printDialogVisible = false

        await this.printOrder()

        await this.updateOrderStatus()
      },
      // 打印订单
      async printOrder() {
        await this.showOrder(this.order.id)

        let subOutputRankPrint = document.getElementById('printOrder')

        let newContent = subOutputRankPrint.innerHTML
        let oldContent = document.body.innerHTML

        document.body.innerHTML = newContent
        window.print()

        window.location.reload()
        document.body.innerHTML = oldContent
      },
      // 更新订单状态
      async updateOrderStatus() {
        const res = await this.$http.patch("order", {
          ...this.order
        })

        if (res.status !== 200) {
          return this.$message.error('更新状态失败')
        }

        this.$message.success('更新状态成功')

        await this.getOrderList()
      },
      // 退款
      refund(order) {
        this.refundDialogVisible = true

        this.order = order
      },
      // 已配送
      finish(order) {
        order.status = "已送达"
        this.order = order

        this.updateOrderStatus()
      },
      // 拒绝退款
      cancelRefund() {
        this.refundDialogVisible = false

        this.order.status = "待配送"

        this.updateOrderStatus()
      },
      // 确认退款
      confirmRefund() {
        this.refundDialogVisible = false

        this.order.status = "已退款"

        this.updateOrderStatus()
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-row {
    margin-bottom: 13px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .title-up {
    font-size: 20px;
  }

  .title-middle {
    font-size: 20px;
    margin-top: 15px;
    margin-bottom: -15px;
  }

  .title-down {
    font-size: 20px;
    margin-top: 15px;
  }

  .my-el-dialog {
    padding-top: -20px;
  }

  .el-dialog__header {
    padding-top: -20px;
  }
</style>
