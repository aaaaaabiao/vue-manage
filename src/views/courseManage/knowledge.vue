<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="5" :xs="24">
        <div class="head-container">
          <el-select
            v-model="queryParams.courseId"
            placeholder="课程"
            clearable
            size="small"
            style="margin-bottom: 20px"
          >
            <el-option
              v-for="course in courseDict"
              :key="course.value"
              :label="course.label"
              :value="course.value"
            />
          </el-select>
        </div>
        <div class="head-container">
          <el-tree
            :data="chapterTree"
            :props="defaultProps"
            :expand-on-click-node="true"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="18" :xs="24">
        <el-row :gutter="10" class="mb10">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加知识点</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="knowledgeList" @selection-change="handleSelectionChange">
          <el-table-column label="知识点" align="center" prop="knowledgeName" />
          <el-table-column label="权重" align="center" prop="weight" />
          <el-table-column label="创建人" align="center" prop="creator" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="160"></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="知识点" prop="knowledgePoint">
              <el-input v-model="form.knowledgePoint" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权重" prop="weigth">
              <el-input-number v-model="form.weight" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      courseDict: [
        { label: "数据结构", value: 1 },
        { label: "计算机组成原理", value: 2 },
        { label: "操作系统", value: 3 },
        { label: "计算机网络", value: 4 }
      ],
      // 遮罩层
      loading: true,

      // 总条数
      total: 0,
      // 用户表格数据
      knowledgeList: [],
      // 弹出层标题
      title: "",
      // 部门树选项
      chapterTree: undefined,
      //章节Id
      chapterId : "",

      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        chapterId: undefined,
        pageNum : 1,
        pageSize: 10
      },
      // 表单校验
      rules: {
        knowledgePoint: [
          { required: true, message: "知识点不能为空", trigger: "blur" }
        ],
        weigth: [{ required: true, message: "权重不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = false;
      this.$request.httpRequest({
        method: "post",
        url: this.API.knowledgeListData,
        params : this.queryParams,
        success: data => {
          console.log(data, data);
          this.knowledgeList = data.data;
        }
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      this.$request.httpRequest({
        method: "post",
        url: this.API.courseChapterTreeData,
        success: data => {
          console.log(data, data);
          this.chapterTree = data.data;
        }
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.chapterId = data.id;
      this.getList();
    },

    // 表单重置
    resetForm(refName) {
      if (this.$refs[refName] !== undefined) {
        this.$refs[refName].resetFields();
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        knowledgePoint: undefined,
        weigth: undefined
      };
      this.resetForm("form");
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加知识点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "修改用户";
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            this.open = false;
          } else {
            this.open = false;
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>

<style scoped>
.mb10 {
  margin-bottom: 10px;
}
.app-container {
  padding: 20px;
}
</style>