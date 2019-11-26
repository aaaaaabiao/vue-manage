<template>
  <div class="table-demo">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="标题" prop="userName">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="userName">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程" prop="courseId">
        <el-select
          v-model="queryParams.courseId"
          placeholder="课程"
          clearable
          size="small"
          style="width: 240px"
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
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
                  <span>{{ props.row.answers}}</span>
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
              <a v-if="$route.meta.delete" class="item" @click="test(scope.row)">删除</a>
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
export default {
  data() {
    return {
      queryParams: {
        title: "",
        creator: "",
        courseId: undefined,
        dateRange: []
      },

      courseDict: [
        { label: "数据结构", value: 1 },
        { label: "计算机组成原理", value: 2 },
        { label: "操作系统", value: 3 },
        { label: "计算机网络", value: 4 }
      ],
      tableLoading: false,
      tableHeader: {
        id: "ID",
        title: "标题",
        courseName: "所属课程",
        userName: "创建人",
        createTime: "创建时间"
      },
      tableData: [],

      pageSize: 20,
      currentPage: 1,
      total: 0
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    getData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.$request.httpRequest({
          method: "post",
          url: this.API.questionListData,
          noLoading: true,
          params: {
            page: this.currentPage,
            limit: this.pageSize
          },
          success: data => {
            console.log(data, data);
            this.tableData = data.data;
            this.total = data.totalCount;
            this.tableLoading = false;
          },
          error: e => {
            this.tableLoading = false;
          }
        });
      }, 3000);
    },
    test(row) {
      console.log("tableRow", row);
    }
  }
};
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
