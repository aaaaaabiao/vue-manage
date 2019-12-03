<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="课程" prop="courseId">
        <el-select v-model="queryParams.courseId" placeholder="课程" clearable size="small">
          <el-option
            v-for="course in courseDict"
            :key="course.value"
            :label="course.label"
            :value="course.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="addCourse"
        >新增课程</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="tableLoading"
      :data="courseChapterList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="title" label="课程/章节" width="200"></el-table-column>
      <el-table-column prop="type" label="类型" width="200"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="creator" label="创建人" width="200"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdTime" width="200"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type !== 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-if="scope.row.type !== 3"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="addChapter(scope.row)"
          >新增</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="章节名" prop="title">
              <el-input v-model="form.title" placeholder="请输入章节名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="addCourseOpen" width="400px">
      <el-form ref="courseform" :model="courseform" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="课程名" prop="courseName">
              <el-input v-model="courseform.courseName" placeholder="请输入课程名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCourseForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courseDict: [],
      // 遮罩层
      tableLoading: true,
      // 表格树数据
      courseChapterList: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 添加课程弹出层
      addCourseOpen: false,
      // 查询参数
      queryParams: {
        chapterId: undefined
      },
      // 表单参数
      form: {},
      //课程表单参数
      courseform: {},
      // 表单校验
      rules: {
        chapterName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        courseName: [
          { required: true, message: "课程名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCourseInfo();
    this.getList();
  },
  mounted() {},
  methods: {
    /** 查询部门列表 */
    getList() {
      this.tableLoading = true;
      setTimeout(() => {
        this.$request.httpRequest({
          method: "post",
          url: this.API.courseChapterData,
          params: {
            courseId: this.queryParams.courseId
          },
          noLoading: true,
          success: data => {
            console.log(data, data);
            this.courseChapterList = data;

            this.tableLoading = false;
          },
          error: e => {
            this.tableLoading = false;
          }
        });
      }, 3000);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    resetForm(refName) {
      if (this.$refs[refName] !== undefined) {
        this.$refs[refName].resetFields();
      }
    },

    // 表单重置
    reset() {
      this.form = {
        chapterId: undefined,
        chapterName: undefined,
        orderNum: undefined,
        parentId: undefined
      };
      this.resetForm("form");
    },
    // 课程表单重置
    courseFormReset() {
      this.courseform = {
        courseName: undefined
      };
      this.resetForm("courseform");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 添加课程 */
    addCourse() {
      this.courseFormReset();
      this.addCourseOpen = true;
      this.title = "添加课程";
    },

    //添加章节
    addChapter(row) {
      this.reset();
      this.form.parentId = row.id;
      this.open = true;
      this.title = "添加课程/章节";
    },

    /** 修改章节 */
    handleUpdate(row) {
      this.reset();
      const chapterId = row.id;
      this.$request.httpRequest({
        method: "post",
        url: this.API.selectChapter,
        params: {
          chapterId: chapterId
        },
        success: data => {
          this.form = data;
          this.open = true;
          this.title = "修改课程/章节";
        }
      });
    },

    //获取所有课程
    getCourseInfo() {
      this.courseDict = [];
      this.$request.httpRequest({
        method: "post",
        url: this.API.getAllCourseInfo,
        success: data => {
          data.forEach(item => {
            const course = {};
            course.label = item.courseName;
            course.value = item.id;
            this.courseDict.push(course);
          });
        },
        error: e => {
          this.msgError("获取课程信息失败");
        }
      });
    },

    submitCourseForm() {
      this.$refs.courseform.validate(valid => {
        if (valid) {
          this.$request.httpRequest({
            method: "post",
            url: this.API.addCourse,
            params: {
              courseName: this.courseform.courseName
            },
            success: data => {
              this.msgSuccess("添加成功");
              console.log(data, data);
              this.addCourseOpen = false;
              this.getCourseInfo();
              this.getList();
            },
            error: e => {
              this.addCourseOpen = false;
              this.msgError("添加失败");
            }
          });
        }
      });
    },

    //更新章节
    updateChapter() {
      this.$request.httpRequest({
        method: "post",
        url: this.API.updateChapter,
        params: {
          chapterName: this.form.title,
          chapterId: this.form.id,
          orderNum: this.form.orderNum
        },
        success: data => {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        },
        error: e => {
          this.open = false;
          this.msgError("修改失败");
        }
      });
    },

    //添加章节
    insertChapter() {
      this.$request.httpRequest({
        method: "post",
        url: this.API.addChapter,
        params: {
          chapterName: this.form.title,
          parentId: this.form.parentId,
          orderNum: this.form.orderNum
        },
        success: data => {
          this.msgSuccess("添加成功");
          this.open = false;
          this.getList();
        },
        error: e => {
          this.open = false;
          this.msgError("添加失败");
        }
      });
    },

    //提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            this.updateChapter();
          } else {
            this.insertChapter();
          }
        }
      });
    },

    deleteChapter(chapterId, type) {
      this.$request.httpRequest({
        method: "post",
        url: this.API.deleteChapter,
        params: {
          chapterId: chapterId,
          type: type
        },
        success: data => {
          this.getList();
          this.getCourseInfo();
          this.msgSuccess("删除成功");
        },
        error: e => {
          this.msgError("删除失败");
        }
      });
    },

    handleDelete(row) {
      const chapterName = row.title;
      const chapterId = row.id;
      const type = row.type;
      this.$confirm("是否确认删除:" + type + "-" + chapterName + "?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deleteChapter(chapterId, type);
      });
    }
  }
};
</script>