<template>
  <div class="table-demo">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select
          v-model="queryParams.roleId"
          placeholder="角色"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="role in roleDict"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
    </el-row>
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
              <a class="item" @click="handleUpdate(scope.row)">修改</a>
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

    <!-- 新增 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="addAdminform" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addAdminform.username" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addAdminform.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select
                v-model="addAdminform.role"
                :placeholder="请选择角色"
                @change="getValue"
                style="width:100%;"
              >
                <el-option
                  v-for="item in roleDict"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="showCourseType">
            <el-form-item label="课程">
              <el-select v-model="addAdminform.courseId" :placeholder="请选择对应课程" style="width:100%;">
                <el-option
                  v-for="item in courses"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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

  <!-- 添加或修改参数配置对话框 -->
</template>
<script>
export default {
  data() {
    return {
      // 表单参数
      addAdminform: {},
      showCourseType: false,
      courses: [
        { label: "数据结构", value: 1 },
        { label: "计算机组成原理", value: 2 },
        { label: "操作系统", value: 3 },
        { label: "计算机网络", value: 4 }
      ],
      open: false,
      queryParams: {
        userId: "",
        userName: "",
        roleId: undefined,
        dateRange: []
      },

      roleDict: this.COMMON.roleDict,

      tableLoading: false,
      tableHeader: {
        id: "ID",
        name: "用户名",
        role: "类型",
        courseType: "所属课程",
        createdTime: "创建时间"
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
          url: this.API.adminData,
          noLoading: true,
          params: {
            userId:this.queryParams.userId,
            userName: this.queryParams.userName,
            dateRange: this.queryParams.dateRange,
            role: this.queryParams.roleId,
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
    },

    reset() {
      this.addAdminform = {
        username: "",
        password: "",
        role: "",
        courseId: ""
      };
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加管理员";
    },
    //取消按钮
    cancel() {
      this.open = false;
    },

    getValue(val) {
      if (val == 3 || val == 4) {
        this.showCourseType = true;
      } else {
        this.showCourseType = false;
      }
    },

    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "修改管理员"
    },

    handleQuery() {
      this.getData()
    },

    resetQuery() {
      this.queryParams = {
        userId : "",
        userName : "",
        dateRange:[],
        roleId: undefined,
      }
    }
  }
};
</script>
<style lang="scss">
@import "~@/styles/table/demo";
.table-demo {
  padding: 25px;
}
.mb8 {
  margin-bottom: 10px;
}
</style>
