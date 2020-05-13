<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图  -->
    <el-card>
      <!--   搜索与添加区域   -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入用户昵名"
                    v-model="queryInfo.nickName" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--   数据表格区   -->
      <el-table :data="userList" border stripe>
        <el-table-column label="id" prop="id" width="80px"></el-table-column>
        <el-table-column label="昵名" prop="nickName"></el-table-column>
        <el-table-column label="头像">
          <template v-slot="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row['avatar']"
              fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="余额">
          <template slot-scope="scope">
            <span>{{scope.row["account"] / 100}} 元</span>
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

        <el-table-column label="操作" width="90px">
          <template v-slot="scope">
            <el-button type="info" size="mini"
                       @click="editUser(scope.row)">编 辑
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

    <el-dialog
      title="用户编辑" width="50%"
      :visible.sync="editUserDialogVision"
      @close="editUserDialogClosed">

      <el-form ref="editUserFormRef" :model="editUserForm"
               :rules="editUserFormRules" label-width="80px">
        <el-form-item label="id">
          <el-input v-model="editUserForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵名" prop="nickName">
          <el-input v-model="editUserForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="editUserForm.avatar"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="account">
          <el-input v-model="editUserForm.account"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVision = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      // 验证规则
      const checkPrice = (rule, value, callback) => {
        const regMobile = /^(\d|[1-9]\d+)(\.\d{1,2})?$/

        if (regMobile.test(value)) {
          // 校验通过
          callback()
        }

        callback(new Error('请输入大于等于零的实数（最大两位小数）'))
      }

      return {
        // 获取商铺列表的参数对象
        queryInfo: {
          nickName: '',
          // 当前页码
          pageNum: 1,
          pageSize: 5
        },
        userList: [],
        totalPage: 0,

        // 编辑窗口
        editUserDialogVision: false,
        // 用于临时保存信息
        user: {},
        editUserForm: {},
        editUserFormRules: {
          nickName: [
            {
              required: true,
              message: '请输入昵名',
              trigger: 'blur'
            }
          ],
          avatar: [
            {
              required: true,
              message: '请输入图片地址',
              trigger: 'blur'
            }
          ],
          account: [
            {
              required: true,
              message: '请输入价格',
              trigger: 'blur'
            },
            {
              validator: checkPrice,
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      // 获取用户列表
      getUserList() {
        this.$http.get("userList", {
          params: this.queryInfo
        }).then(res => {
          this.userList = res.data["data"]

          // 记录总条数
          this.totalPage = res.data["totalCounts"]
        }, () => {
          return this.$message.error('获取用户列表失败')
        })
      },
      // pageSize 改变事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize

        this.getUserList()
      },
      // 页码值的改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage

        this.getUserList()
      },
      // 打开审核窗口
      editUser(user) {
        this.editUserForm = user

        // 换算为元
        this.editUserForm.account = this.editUserForm.account / 100

        this.editUserDialogVision = true
      },
      updateUser() {
        // 换算回分
        this.editUserForm.account = this.editUserForm.account * 100

        this.$http.patch("user", {
          ...this.editUserForm
        }).then(() => {
          this.editUserDialogVision = false

          this.$message.success("更新成功")

          this.getUserList()
        }, () => {
          this.$message.error("更新失败")
        })
      },
      editUserDialogClosed() {
        this.$refs.editUserFormRef.resetFields()
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
