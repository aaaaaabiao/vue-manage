<template>
  <div class="app-container">
    <el-form :inline="true">
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
      row-key="deptId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="chapterName" label="部门名称" width="200"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="creator" label="创建人" width="200"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="addChapter(scope.row)">新增</el-button>
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
            <el-form-item label="章节名" prop="chapterName">
              <el-input v-model="form.chapterName" placeholder="请输入部门名称" />
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
      <el-form ref="form" :model="courseform" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="课程名" prop="courseName">
              <el-input v-model="courseform.courseName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courseDict: [
        { label: "数据结构", value: 1 },
        { label: "计算机组成原理", value: 2 },
        { label: "操作系统", value: 3 },
        { label: "计算机网络", value: 4 }
      ],
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
        chapterName: undefined
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
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.tableLoading = true;
      setTimeout(() => {
        this.$request.httpRequest({
          method: "post",
          url: this.API.courseChapterData,
          noLoading: true,
          success: data => {
            console.log(data, data);
            this.courseChapterList = data.data;
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
        chapterName: undefined,
        orderNum: undefined,
      };
      this.resetForm("form");
    },
    // 课程表单重置
    courseFormReset() {
      this.courseform = {
        course: undefined,
      };
      this.resetForm("courseform");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 添加课程 */
    addCourse() {
      this.courseFormReset()
      this.addCourseOpen = true;
      this.title = "添加课程";
    },


    //添加章节
    addChapter(row) {
      this.reset()
      this.open = true
      this.title = "添加章节"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改部门";
      });
    }
  }
};
</script>