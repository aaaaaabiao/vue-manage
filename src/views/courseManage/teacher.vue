<template>
  <div class="table-demo">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="用户ID" prop="userName">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="queryParams.dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col> -->
    </el-row>
    <el-card class="list-content" shadow="hover">
      <template v-if="$route.meta.check">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          :cell-style="{ whiteSpace: 'nowrap'}"
          :header-row-style="{ background: '#EBEEF5'}"
          style="width: 100%"
          class="table-content"
        >
          <el-table-column type="index" label="序号" align="center" sortable width="50" />
          <el-table-column
            v-for="(item,index) in tableHeader"
            :key="index"
            :prop="index"
            sortable
            :label="item"
            align="center"
          />
          <el-table-column label="操作" width="230" align="center" class-name="operation">
            <template slot-scope="scope">
              <!-- <a class="item" @click="handleUpdate(scope.row)">修改</a> -->
              <a v-if="$route.meta.delete" class="item" @click="handleDelete(scope.row)">撤销权限</a>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div v-else class="no-data">您暂时没有查看的权限</div>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      v-if="$route.meta.check"
      :total="total"
      :pager-count="5"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      :current-page="currentPage"
      background
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="addAdminform" :model="addAdminform" :rules="rules" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addAdminform.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addAdminform.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>

  <!-- 添加或修改参数配置对话框 -->
</template>
<script>
import { dateFormat } from '@/assets/utils/index.js'
export default {
  data() {
    return {
      // 表单参数
      addAdminform: {},
      courses: [],

      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码名称不能为空', trigger: 'blur' }
        ],
        role: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      },
      open: false,
      queryParams: {
        userId: undefined,
        userName: undefined,
        dateRange: undefined
      },

      roleDict: [
        { label: '管理员', value: 2 },
        { label: '课程负责人', value: 3 }
      ],

      tableLoading: false,
      tableHeader: {
        id: 'ID',
        name: '用户名',
        role: '类型',
        courseType: '所属课程',
        createdTime: '创建时间'
      },
      tableData: [],

      pageSize: 20,
      currentPage: 1,
      total: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },
    getData() {
      this.tableLoading = true
      setTimeout(() => {
        this.$request.httpRequest({
          method: 'post',
          url: this.API.getTeachers,
          noLoading: true,
          params: {
            userId: this.queryParams.userId,
            userName: this.queryParams.userName,
            dateRange: this.queryParams.dateRange,
            page: this.currentPage,
            limit: this.pageSize
          },
          success: data => {
            console.log(data, data)
            const teacherList = data.data
            teacherList.forEach(item => {
              item.createdTime = dateFormat(item.createdTime)
            })
            this.tableData = teacherList
            this.total = data.totalCount
            this.tableLoading = false
          },
          error: e => {
            this.tableLoading = false
          }
        })
      }, 500)
    },
    test(row) {
      console.log('tableRow', row)
    },

    reset() {
      this.addAdminform = {
        userId: undefined,
        username: undefined,
        password: undefined
      }
    },
    handleAdd() {
      // this.getCourseInfo()
      this.reset()
      this.open = true
      this.title = '添加任课教师'
    },
    // 取消按钮
    cancel() {
      this.open = false
    },

    // 修改
    handleUpdate(row) {
      this.getCourseInfo()
      const userId = row.id
      this.$request.httpRequest({
        method: 'post',
        url: this.API.selectAdminByID,
        params: {
          userId: userId
        },
        success: data => {
          (this.addAdminform = {
            userId: data.id,
            username: data.username,
            password: data.password
          }),
          (this.title = '修改任课教师')
          this.open = true
        }
      })
    },

    handleQuery() {
      this.getData()
    },

    deleteAdmin(userId) {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.deleteAdmin,
        params: {
          userId: userId
        },
        success: data => {
          this.getData()
          this.msgSuccess('删除成功')
        },
        error: e => {
          this.msgError('删除失败')
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const username = row.name
      this.$confirm('是否确认撤销用户:' + username + '权限?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.authTeacher(2, username)
      })
    },

    // 获取所有课程
    getCourseInfo() {
      this.courses = []
      this.$request.httpRequest({
        method: 'post',
        url: this.API.getAllCourseInfo,
        success: data => {
          data.forEach(item => {
            const course = {}
            course.label = item.courseName
            course.value = item.id
            this.courses.push(course)
          })
        }
      })
    },

    // 更新管理员信息
    updateUser() {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.updateAdmin,
        params: this.addAdminform,
        success: data => {
          this.msgSuccess('修改成功')
          this.open = false
          this.getData()
        },
        error: e => {
          this.open = false
          this.msgError('修改失败')
        }
      })
    },

    // 添加管理员
    addUser() {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.addAdmin,
        params: this.addAdminform,
        success: data => {
          this.msgSuccess('添加成功')
          this.open = false
          this.getData()
        },
        error: e => {
          this.open = false
          this.msgError('添加失败')
        }
      })
    },

    // 提交表单
    submitForm() {
      this.$refs.addAdminform.validate(valid => {
        if (valid) {
          const username = this.addAdminform.username
          this.authTeacher(0, username, undefined)
        }
      })
    },
    authTeacher(opt, username, courseType) {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.authTeacher,
        params: {
          opt: opt,
          username: username,
          courseType: courseType
        },
        success: data => {
          this.msgSuccess('操作成功')
          this.open = false
          this.getData()
        },
        error: e => {
          this.open = false
          this.msgError('操作失败')
        }
      })
    },
    resetQuery() {
      this.queryParams = {
        userId: undefined,
        userName: undefined,
        dateRange: undefined
      }
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/table/demo";
.table-demo {
  padding: 25px;
}
.mb8 {
  margin-bottom: 10px;
}
</style>
