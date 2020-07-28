<template>
  <div class="users">
    <!--面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="getUserList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisibleShow">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userList" border stripe style="margin-top: 15px;font-size: 12px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogVisibleShow(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"  @click="setRole(scope.row)"></el-button>
          </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        style="margin-top: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
  <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>

    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="eidtDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>

    <!--分配角色的对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed">
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>分配角色:
          <el-select v-model="selectedRoleID" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      let checkEmail = (rule, value, next) => {
        const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        if (regEmail.test(value)) {
          next()
        }
        next(new Error("请输入合法的邮箱"))

      }
      let checkMobile = (rule, value, next) => {
        const regMobile = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
        if (regMobile.test(value)) {
          next()
        }
        next(new Error("请输入合法的手机号码"))
      }
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        setRoleDialogVisible: false,
        userInfo: {},
        roleList: [],
        selectedRoleID: '',
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        editForm: {},
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3,max: 10, message: "用户名长度在3~10字符之间", trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6,max: 16, message: "密码长度在6~16字符之间", trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail ,trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: checkMobile ,trigger: 'blur'}
          ],
        },
        editFormRules: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail ,trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: checkMobile ,trigger: 'blur'}
          ],
        },
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList(){
        const {data : result} = await this.$http.get('users', {params: this.queryInfo})
        if (result.meta.status !== 200) return this.$message.error({duration:500, message:"获取用户列表失败"})
        this.userList = result.data.users
        this.total = result.data.total
      },
      handleSizeChange(newValue){
        this.queryInfo.pagesize = newValue
        this.getUserList()
      },
      handleCurrentChange(newValue){
        this.queryInfo.pagenum = newValue
        this.getUserList()
      },
      async userStateChange(userInfo) {
        const {data : result} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if (result.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error({duration:1000, message:"更改用户状态失败"})
        }else {
          return this.$message.success({duration:1000, message:"更改用户状态成功"})
        }
      },
      addDialogVisibleShow() {
        this.addDialogVisible = true
      },
      async editDialogVisibleShow(id) {
        const {data : result} = await this.$http.get('users/' + id)
        if (result.meta.status !== 200) return this.$message.error({duration:1000, message:"查询用户失败"})
        this.editForm = result.data
        this.editDialogVisible = true
      },
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      editDialogClose() {
        this.$refs.editFormRef.resetFields()
      },
      addUser() {
        this.$refs.addFormRef.validate(async vaild => {
          if (!vaild) return false
          const {data : result} = await this.$http.post('users', this.addForm)
          if (result.meta.status !== 201 )  return this.$message.error({duration:1000, message:"添加用户失败"})
          this.$message.success({duration:1000, message:"添加用户成功"})
          this.addDialogVisible = false
          this.getUserList()
        })
      },
      editUser() {
        this.$refs.editFormRef.validate(async vaild => {
          if (!vaild) return false
          const {data : result} = await this.$http.put('users/' + this.editForm.id, {
            email : this.editForm.email,
            mobile : this.editForm.mobile
          })
          if (result.meta.status !== 200 )  return this.$message.error({duration:1000, message:"更新用户失败"})
          this.$message.success({duration:1000, message:"更新用户成功"})
          this.editDialogVisible = false
          this.getUserList()
        })
      },
      deleteUser(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data : result} = await this.$http.delete('users/' + id)
          if (result.meta.status !== 200) return this.$message.error({duration:500, message:"删除用户失败"})
          this.$message({type: 'success', message: '删除用户成功!'})
          this.getUserList()
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'})
        });
      },
      async setRole(userInfo) {
        this.userInfo = userInfo
        const {data : result} = await this.$http.get('roles')
        if (result.meta.status !== 200) return this.$message.error('获取角色列表失败')
        this.roleList = result.data
        this.setRoleDialogVisible = true
      },
      async saveRoleInfo() {
        if (!this.selectedRoleID) {
          return this.$message.error('请选择要分配的角色')
        }
        const {data : result} = await this.$http.put(`users/${this.userInfo.id}/role`, { rid : this.selectedRoleID})
        if (result.meta.status !== 200 ) return this.$message.error('更新角色失败')
        this.$message.success('更新角色成功')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      setRoleDialogClosed() {
        this.selectedRoleID = ''
        this.userInfo = {}
      }
    }
  }
</script>

<style scoped>

</style>
