<template>
  <div class="table-demo">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="问题标题" prop="questionTitle">
        <el-input
          v-model="queryParams.questionTitle"
          placeholder="请输入问题标题"
          clearable
          size="small"
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
              <a v-if="$route.meta.delete" class="item" @click="detail(scope.row)">详情</a>
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
    <el-dialog :title="title" :model="answerDetail" :visible.sync="open" width="800px">
      <el-row>
        <el-col :span="24">
          <h2 style="text-align: center">{{answerDetail.questionTitle}}</h2>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="24">
          <div v-html="answerDetail.questionDesc" style="text-align: center"></div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="24">
          <div v-html="answerDetail.content" style="text-align: center">{{answerDetail.content}}</div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteAnswer(answerDetail.answerId)">删除</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      open: false,
      queryParams: {},
      answerDetail: {},
      courseDict: [],
      tableLoading: false,
      tableHeader: {
        question: "问题",
        courseName: "所属课程",
        originName: "来源",
        createdTime: "创建时间"
      },
      tableData: [],

      pageSize: 20,
      currentPage: 1,
      total: 0
    };
  },
  created() {
    this.resetQuery();
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
          url: this.API.QaList,
          noLoading: true,
          params: {
            questionTitle: this.queryParams.questionTitle,
            dateRange: this.queryParams.dateRange,
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
      }, 300);
    },

    handleQuery() {
      this.getData();
    },

    resetQuery() {
      this.queryParams = {
        questionTitle: undefined,
        dateRange: undefined
      };
    },

    deleteAnswer(answerId) {
      this.$request.httpRequest({
        method: "post",
        url: this.API.deleteQa,
        params: {
          answerId: answerId
        },
        success: data => {
          this.open = false;
          this.getData();
          this.msgSuccess("删除成功");
        },
        error: e => {
          this.open = false;
          this.msgError("删除失败");
        }
      });
    },

    handleDelete(row) {
      const answerId = row.id;
      this.$confirm("是否确认删除ID为:" + answerId + "的问题?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deleteAnswer(answerId);
      });
    },

    detail(row) {
      this.open = true;
      const answerId = row.id;
      this.$request.httpRequest({
        method: "post",
        url: this.API.selectAnswer,
        params: {
          answerId: answerId
        },
        success: data => {
          this.answerDetail = {
            answerId: data.id,
            questionTitle: data.questionTitle,
            questionDesc: data.questionDesc,
            content: data.content
          };
        }
      });
    },

    cancel() {
      this.open = false;
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
