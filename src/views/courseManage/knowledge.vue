<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="5" :xs="24">
        <!-- <div class="head-container">
          <el-select
            v-model="courseId"
            placeholder="课程"
            clearable
            size="small"
            style="margin-bottom: 20px"
            @change="courseChange"
          >
            <el-option
              v-for="course in courseDict"
              :key="course.value"
              :label="course.label"
              :value="course.value"
            />
          </el-select>
        </div> -->
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="chapterTree"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
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

        <el-table
          v-loading="loading"
          :data="knowledgeList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          row-key="knowledgeId"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="知识点" align="center" prop="title" />
          <el-table-column label="创建人" align="center" prop="creator" />
          <!-- <el-table-column label="创建时间" align="center" prop="createdTime" width="160" /> -->
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
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="1"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="open" width="300px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="知识点" prop="chapterName">
              <el-input v-model="form.chapterName" placeholder="请输入知识点" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="权重" prop="weight">
              <el-input-number
                v-model="form.weight"
                controls-position="right"
                :min="0"
                :max="1"
                :step="0.1"
              />
            </el-form-item>
          </el-col> -->
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
      pagesize: 10,
      total: 3,
      currentPage: 1,
      open: false,
      courseDict: [],
      // 遮罩层
      loading: true,

      // 用户表格数据
      knowledgeList: [],
      // 弹出层标题
      title: '',
      // 部门树选项
      chapterTree: undefined,
      // 章节Id
      chapterId: '',

      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // 查询参数
      queryParams: {
        chapterId: undefined,
        type: undefined
      },
      // 表单校验
      rules: {
        knowledgePoint: [
          { required: true, message: '知识点不能为空', trigger: 'blur' }
        ]
        // weight: [{ required: true, message: '权重不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // this.getCourseInfo()
    this.getList()
    this.getTreeselect()
  },
  methods: {
    // 获取所有课程
    getCourseInfo() {
      this.courseDict = []
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

    /** 查询知识点列表 */
    getList() {
      if (this.queryParams.chapterId !== undefined) {
        console.log(this.queryParams.chapterId)
        this.loading = true
        this.$request.httpRequest({
          method: 'post',
          url: this.API.knowledgeListData,
          params: this.queryParams,
          success: data => {
            console.log(data, data)
            this.loading = false
            this.knowledgeList = data
            this.total = data.length
          },
          error: e => {
            this.loading = false
          }
        })
      }

      this.loading = false
    },
    /** 查询课程下拉树 */
    getTreeselect() {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.courseChapterData,
        success: data => {
          console.log(data)
          this.chapterTree = data
        }
      })
    },
    // // 筛选节点
    // filterNode(value, data) {
    //   if (!value) return true;
    //   return data.label.indexOf(value) !== -1;
    // },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.chapterId = data.id
      this.queryParams.type = data.type
      this.getList()
    },

    // 表单重置
    resetForm(refName) {
      if (this.$refs[refName] !== undefined) {
        this.$refs[refName].resetFields()
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        chapterName: undefined,
        parentId: undefined,
        orderNum: undefined,
        weight: undefined

      }
      this.resetForm('form')
    },

    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.form.parentId = this.queryParams.chapterId
      console.log(this.form.parentId)
      this.open = true
      this.title = '添加知识点'
    },

    /** 修改章节 */
    handleUpdate(row) {
      this.reset()
      const knowledgeId = row.id
      this.$request.httpRequest({
        method: 'post',
        url: this.API.selectChapter,
        params: {
          chapterId: knowledgeId
        },
        success: data => {
          this.form = {
            chapterId: data.id,
            chapterName: data.title,
            weight: data.weight,
            parentId: data.parentId
          }
          this.open = true
          this.title = '修改知识点'
        }
      })
    },

    // 更新章节
    updateknowledge() {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.updateChapter,
        params: this.form,
        success: data => {
          this.msgSuccess('修改成功')
          this.open = false
          this.getList()
          this.getTreeselect()
        },
        error: e => {
          this.open = false
          this.msgError('修改失败')
        }
      })
    },

    // 添加章节
    insertKnowledge() {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.addChapter,
        params: this.form,
        success: data => {
          this.msgSuccess('添加成功')
          this.open = false
          this.getList()
          this.getTreeselect()
        },
        error: e => {
          this.open = false
          this.msgError('添加失败')
        }
      })
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.chapterId != undefined) {
            this.updateknowledge()
          } else {
            this.insertKnowledge()
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const knowledgeId = row.id
      const knowledgeName = row.title
      this.$confirm('是否确认删除知识点"' + knowledgeName + '?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteChapter(knowledgeId)
      })
    },

    deleteChapter(chapterId) {
      this.$request.httpRequest({
        method: 'post',
        url: this.API.deleteChapter,
        params: {
          chapterId: chapterId,
          type: 4
        },
        success: data => {
          this.getList()
          this.getTreeselect()
          this.msgSuccess('删除成功')
        },
        error: e => {
          this.msgError('删除失败')
        }
      })
    },

    courseChange(val) {
      this.getTreeselect()
      this.getList()
    },

    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }
  }
}
</script>

<style scoped>
.mb10 {
  margin-bottom: 10px;
}
.app-container {
  padding: 20px;
}
</style>
