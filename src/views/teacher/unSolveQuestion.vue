<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="8" :xs="24">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" sortable width="50" />
          <el-table-column prop="title" label="问题"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="ignore(scope.row)">忽略</el-button>
              <el-button size="mini" type="primary" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="total"
          :pager-count="10"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :current-page="currentPage"
          background
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
      <!--用户数据-->
      <el-col :span="16" :xs="24">
        <el-collapse-transition>
          <el-card class="box-card" v-show="show">
            <el-divider content-position="left">待回答问题</el-divider>
            <div>
              <p>问题:</p>
              <p style="text-indent: 2em" v-text="unsolveQuestion.title"></p>
            </div>
            <el-divider content-position="left">添加答案</el-divider>
            <el-form ref="form" v-model="form">
              <el-form-item>
                <el-input type="textarea" v-model="from.answer" :rows="15"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" style="float:right" @click="addQa">添加答案</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-collapse-transition>
      </el-col>
    </el-row>
  </div>
</template>

  <script>
export default {
  data() {
    return {
      pageSize: 20,
      currentPage: 1,
      total: 0,
      tableData: [
        {
          id: 1,
          title: "TCP为什么三次握手？"
        },
        {
          id: 2,
          title: "TCP为什么三次握手？"
        },
        {
          id: 3,
          title: "TCP为什么三次握手？"
        },
        {
          id: 4,
          title: "TCP为什么三次握手？"
        }
      ],

      from: {

      },

      unsolveQuestion: {
        title: "TCP为什么三次握手？"
      },

      show: false
    };
    
  },

  created() {
    this.getQuestionList();
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
    getQuestionList() {
      // this.tableData = [];
      // this.$request.httpRequest({
      //   method: "post",
      //   url: this.API.getUnsolveQuestion,
      //   success: data => {
      //     data.forEach(item => {
      //       this.tableData.push(data);
      //     });
      //   }
      // });
    },

    ignore(row) {
      this.show = false;
    },

    detail(row) {
      // const id = row.id
      // this.$request.httpRequest({
      //   method: "post",
      //   params: {
      //     "qid": id
      //   },
      //   url: this.API.getUnsloveQuestionDetail,
      //   success: data => {
      //     this.unsolveQuestion = data
      //     this.show = true;
      //   }
      // });
      this.show = true;
    },

    addQa() {
      this.$request.httpRequest({
        method: "post",
        params: {
          "question": this.unsolveQuestion.title,
          "answer": this.from.answer
        },
        url: this.API.addQa,
        success: data => {
          this.msgSuccess("添加成功");
          this.show = false;
          this.getQuestionList();
        },
        error: e => {
          this.msgError("添加失败");
        }
      });

      this.msgSuccess("添加成功");
      this.show = false;
    }
  }
};
</script>

<style lang="scss">
.app-container {
  padding: 20px;
}
</style>
