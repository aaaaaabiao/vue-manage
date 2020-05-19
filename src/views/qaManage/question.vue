<template>
  <div class="table-demo">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="问题ID" prop="questionId">
        <el-input
          v-model="queryParams.questionId"
          placeholder="请输入问题ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标题" prop="userName">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="创建人" prop="userName">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程" prop="courseId">
        <el-select
          v-model="queryParams.courseId"
          placeholder="课程"
          clearable
          size="small"
        >
          <el-option
            v-for="course in courseDict"
            :key="course.value"
            :label="course.label"
            :value="course.value"
          />
        </el-select>
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
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="问题ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="标题">
                  <span>{{ props.row.title }}</span>
                </el-form-item>
                <el-form-item label="描述">
                  <span>{{ props.row.description }}</span>
                </el-form-item>
                <el-form-item label="课程">
                  <span>{{ props.row.courseName }}</span>
                </el-form-item>
                <el-form-item label="用户名">
                  <span>{{ props.row.userName }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ props.row.createTime }}</span>
                </el-form-item>
                <el-form-item label="回答数">
                  <span>{{ props.row.answers }}</span>
                </el-form-item>
                <el-form-item label="关注数">
                  <span>{{ props.row.followers }}</span>
                </el-form-item>
                <el-form-item label="收藏数">
                  <span>{{ props.row.collections }}</span>
                </el-form-item>
                <el-form-item label="评论数">
                  <span>{{ props.row.comments }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
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
              <a v-if="$route.meta.delete" class="item" @click="handleDelete(scope.row)">删除</a>
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
  </div>
</template>
<script>
import { dateFormat } from '@/assets/utils/index.js'
export default {
  data() {
    return {
      queryParams: {},

      courseDict: [],
      tableLoading: false,
      tableHeader: {
        id: 'ID',
        title: '标题',
        courseName: '所属课程',
        userName: '创建人',
        createdAt: '创建时间'
      },
      tableData: [],

      pageSize: 20,
      currentPage: 1,
      total: 0
    }
  },
  mounted() {
    this.resetQuery()
    this.getData()
    this.getCourseInfo()
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
          url: this.API.questionListData,
          noLoading: true,
          params: {
            questionId: this.queryParams.questionId,
            title: this.queryParams.title,
            creator: this.queryParams.creator,
            courseId: this.queryParams.courseId,
            dateRange: this.queryParams.dateRange,
            page: this.currentPage,
            limit: this.pageSize
          },
          success: data => {
            console.log(data, data)
            const questionList = data.data
            questionList.forEach(item => {
              item.createdAt = dateFormat(item.createdAt)
            })
            this.tableData = questionList
            this.total = data.totalCount
            this.tableLoading = false
          },
          error: e => {
            this.tableLoading = false
          }
        })
      }, 500)
    },
    // 获取所有课程
    getCourseInfo() {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.getAllCourseInfo,
        success: data => {
          data.forEach(item => {
            const course = {}
            course.label = item.courseName
            course.value = item.id
            this.courseDict.push(course)
          })
        }

      })
    },

    handleQuery() {
      this.getData()
    },

    resetQuery() {
      this.queryParams = {
        questionId: undefined,
        title: undefined,
        creator: undefined,
        courseId: undefined,
        dateRange: []
      }
    },

    deleteQuestion(questionId) {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.deleteQuestion,
        params: {
          questionId: questionId
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

    handleDelete(row) {
      const questionId = row.id
      this.$confirm('是否确认删除ID为:' + questionId + '的问题?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteQuestion(questionId)
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
