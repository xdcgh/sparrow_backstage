<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>生鲜管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图  -->
    <el-card>
      <!--   搜索与添加区域   -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入生鲜"
                    v-model="queryInfo.freshName" clearable @clear="getFreshList">
            <el-button slot="append" icon="el-icon-search" @click="getFreshList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--   数据表格区   -->
      <el-table :data="freshList" border stripe>
        <el-table-column label="id" prop="id" width="50px"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="图片">
          <template v-slot="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row['picture']"
              fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="库存" prop="stock"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>

        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit"
                       size="mini" @click="showEditDialog(scope.row.id)"></el-button>

            <el-tooltip effect="dark" content="切换当前生鲜状态" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-s-tools"
                         size="mini" @click="updateStatusById(scope.row)"></el-button>
            </el-tooltip>
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

    <!--  生鲜编辑的对话框  -->
    <el-dialog
      title="生鲜编辑" width="50%"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed">

      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="picture">
          <el-input v-model="editForm.picture"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <template>
            <el-select v-model="editForm.status" placeholder="请选择">
              <el-option
                v-for="item in freshStatusList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="类型" prop="freshType">
          <template>
            <el-select v-model="editForm.typeId" placeholder="请选择">
              <el-option
                v-for="item in freshTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="editForm.stock"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateFresh">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      // 验证规则
      const checkStock = (rule, value, callback) => {
        const regMobile = /^(0|[1-9][0-9]*)$/

        if (regMobile.test(value)) {
          // 校验通过
          callback()
        }

        callback(new Error('请输入大于等于零的整数'))
      }

      const checkPrice = (rule, value, callback) => {
        const regMobile = /^(\d|[1-9]\d+)(\.\d{1,2})?$/

        if (regMobile.test(value)) {
          // 校验通过
          callback()
        }

        callback(new Error('请输入大于等于零的实数（最大两位小数）'))
      }

      return {
        // 获取用户列表的参数对象
        queryInfo: {
          freshName: '',
          // 当前页码
          pageNum: 1,
          pageSize: 3
        },
        freshList: [],
        totalPage: 0,

        // 用户对话框的显示值
        editDialogVisible: false,
        editForm: {},

        freshStatusList: ["在线", "下架"],
        freshTypeList: [],

        editFormRules: {
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ],
          picture: [
            {
              required: true,
              message: '请输入图片地址',
              trigger: 'blur'
            }
          ],
          description: [
            {
              required: true,
              message: '请输入描述',
              trigger: 'blur'
            }
          ],
          stock: [
            {
              required: true,
              message: '请输入库存',
              trigger: 'blur'
            },
            {
              validator: checkStock,
              trigger: 'blur'
            }
          ],
          price: [
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
      this.getFreshList()

      this.getFreshTypeList()
    },
    methods: {
      async getFreshList() {
        const res = await this.$http.get("freshList", {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取用户列表失败')
        }

        this.freshList = res.data["data"]

        // 记录总条数
        this.totalPage = res.data["totalCounts"]
      },
      // pagesize 改变事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize

        this.getFreshList()
      },
      // 页码值的改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage

        this.getFreshList()
      },
      // switch 状态改变事件
      async freshStateChanged(userInfo) {
        const res = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)

        if (res.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更新状态失败')
        }

        this.$message.success('更新用户状态成功')
      },
      // 添加用户 对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      addUser() {
        this.$refs.addFormRef.validate(async valid => {

          if (!valid) {
            return
          }

          const res = await this.$http.post('users', this.addForm)

          if (res.status !== 201) {
            return this.$message.error('添加用户失败！')
          }

          this.$message.success('添加用户成功！')

          this.addDialogVisible = false

          await this.getFreshList()
        })
      },
      async showEditDialog(id) {
        const res = await this.$http.get(`fresh/${id}`)

        if (res.status !== 200) {
          return this.$message.error('查询生鲜失败')
        }

        this.editForm = res.data

        this.editDialogVisible = true
      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      updateFresh() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) {
            return
          }

          const res = await this.$http.patch(`fresh`, {
            ...this.editForm
          })

          if (res.status !== 200) {
            return this.$message.error('更新失败')
          }

          this.$message.success('更新成功')

          this.editDialogVisible = false

          await this.getFreshList()
        })
      },
      async updateStatusById(fresh) {

        if (fresh["status"] === "在线") {
          fresh["status"] = "下架"
        } else {
          fresh["status"] = "在线"
        }

        const res = await this.$http.patch("fresh", {
          ...fresh
        })

        if (res.status !== 200) {
          return this.$message.error('生鲜状态切换失败')
        }

        this.$message.success('生鲜状态切换成功')

        await this.getFreshList()
      },
      async getFreshTypeList() {
        const res = await this.$http.get("freshType")

        if (res.status !== 200) {
          return this.$message.error('生鲜状态切换失败')
        }

        this.freshTypeList = res.data
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
