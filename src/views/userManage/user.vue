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
          <!-- <el-table-column label="操作" width="230" align="center" class-name="operation">
            <template slot-scope="scope">
              <a v-if="$route.meta.delete" class="item" @click="handleDelete(scope.row)">删除</a>
            </template>
          </el-table-column> -->
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
  </div>
</template>
<script>
import { dateFormat } from '@/assets/utils/index.js'
export default {
  data() {
    return {
      queryParams: {
        userId: undefined,
        userName: undefined,
        dateRange: undefined
      },
      tableLoading: false,
      tableHeader: {
        id: 'ID',
        name: '用户名',
        email: '邮箱',
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
          url: this.API.userData,
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
            const userList = data.data
            userList.forEach(item => {
              item.createdTime = dateFormat(item.createdTime)
            })
            this.tableData = userList
            this.total = data.totalCount
            this.tableLoading = false
          },
          error: e => {
            this.tableLoading = false
          }
        })
      }, 500)
    },

    handleQuery() {
      this.getData()
    },

    resetQuery() {
      this.queryParams = {
        userId: undefined,
        userName: undefined,
        dateRange: undefined
      }
    },

    deleteUserByUserId(userId) {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.deleteUser,
        params: {
          userId: userId
        },
        success: data => {
          this.getData()
          console.log('删除成功')
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
      const userId = row.id
      this.$confirm('是否确认删除用户:' + username + '?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUserByUserId(userId)
      })
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/table/demo";
.table-demo {
  padding: 25px;
}
</style>
