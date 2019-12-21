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
            <el-divider content-position="left">讨论区问答</el-divider>
            <div>
              <p>问题:</p>
              <p style="text-indent: 2em" v-text="cqaInfo.title"></p>
            </div>
            <div>
              <p>描述:</p>
              <p style="text-indent: 2em" v-text="cqaInfo.desc"></p>
            </div>
            <div>
              <p>答案:</p>
              <p style="text-indent: 2em" v-html="cqaInfo.bestAnswer"></p>
            </div>
            <el-button type="primary" size="mini" @click="checkQa" style="float:right">审核通过</el-button>
            <br />
            <br />
            <!-- <el-divider content-position="left">问题</el-divider>
            <h2 v-text="cqaInfo.title"></h2>
            <el-divider content-position="left">描述</el-divider>
            <h2 v-text="cqaInfo.desc"></h2>
            <el-divider content-position="left">用户答案</el-divider>
            <p v-text="cqaInfo.bestAnswer"></p>
            <el-button type="primary" size="mini" @click="onSubmit" style="float:right">审核通过</el-button>
            <br />
            <br />-->
            <el-divider content-position="left">添加答案</el-divider>

            <el-form ref="form" v-model="form">
              <el-form-item>
                <el-input type="textarea" v-model="from.answer" :rows="10"></el-input>
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

      from: {},

      cqaInfo: {
        title: "TCP为什么三次握手？",
        desc: "TCP为什么三次握手？",
        bestAnswer:
          "在谢希仁著《计算机网络》第四版中讲“三次握手”的目的是“为了防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误”。在另一部经典的《计算机网络》一书中讲“三次握手”的目的是为了解决“网络中存在延迟的重复分组”的问题。这两种不用的表述其实阐明的是同一个问题。"
      },

      show: false,
      questionId: undefined
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
      this.tableData = [];
      this.$request.httpRequest({
        method: "post",
        params: {
          page: this.currentPage,
          limit: this.pageSize
        },
        url: this.API.getCqaQuestion,
        success: data => {
          this.total = data.totalCount;
          const questionList = data.data;
          if (questionList) {
            questionList.forEach(item => {
              const question = {};
              question.id = item.id;
              question.title = item.title;
              this.tableData.push(question);
            });
          }
        }
      });
    },

    ignore(row) {
      this.show = false;
    },

    detail(row) {
      const id = row.id;
      this.questionId = id;
      this.$request.httpRequest({
        method: "post",
        params: {
          qId: id
        },
        url: this.API.getCqaQuestionDetail,
        success: data => {
          const question = data.question;
          const answer = data.bestAnswer;
          this.cqaInfo.title = question.title;
          this.cqaInfo.desc = question.description;
          this.cqaInfo.bestAnswer = answer.content;

          this.show = true;
        }
      });
      this.show = true;
    },

    checkQa() {
      this.$request.httpRequest({
        method: "post",
        params: {
          question: this.cqaInfo.title,
          desc: this.cqaInfo.desc,
          answer: this.cqaInfo.bestAnswer,
          origin: 1,
          questionId: this.questionId
        },
        url: this.API.addQa,
        success: data => {
          this.msgSuccess("审核成功");
          this.show = false;
          this.getQuestionList();
        },
        error: e => {
          this.msgError("审核失败");
        }
      });
    },
    addQa() {
      this.$request.httpRequest({
        method: "post",
        params: {
          question: this.cqaInfo.title,
          desc: this.cqaInfo.desc,
          answer: this.from.answer,
          origin: 1,
          questionId: this.questionId
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
    }
  }
};
</script>

<style lang="scss">
.app-container {
  padding: 20px;
}
</style>
