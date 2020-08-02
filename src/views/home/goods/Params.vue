<template>
  <div class="params">
    <!--面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置相关参数" type="warning"  :closable="false" show-icon>
      </el-alert>

      <el-row style="margin: 15px">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            clearable
            @change="handleChanged"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                  style="width: 120px"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="onlyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                  style="width: 120px"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      @close="addDialogClosed"
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      @close="editDialogClosed"
      :title="'添加' + titleText"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Params",
    data() {
      return {
        cateList: [],
        selectedKeys: [],
        activeName: 'many',
        manyTabData: [],
        onlyTabData: [],
        addDialogVisible: false,
        editDialogVisible: false,
        addForm: {
          attr_name: ''
        },
        editForm: {},
        addFormRules: {
          attr_name: [
            {required:true, message:'请输入参数名称', trigger:'blur'}
          ]
        },
        editFormRules: {
          attr_name: [
            {required:true, message:'请输入参数名称', trigger:'blur'}
          ]
        },
      }
    },
    computed: {
      isBtnDisabled() {
        return this.selectedKeys.length !== 3
      },
      cateId() {
        if (this.selectedKeys.length === 3) {
          return this.selectedKeys[2]
        }
        return null
      },
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }else {
          return '静态参数'
        }
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {data : result} = await this.$http.get('categories')
        if (result.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.cateList = result.data
      },
      handleChanged() {
        this.getParamsData()
      },
      handleTabClick() {
        this.getParamsData()
      },
      async getParamsData() {
        if (this.selectedKeys.length !== 3) {
          this.selectedKeys = []
          this.manyTabData = []
          this.onlyTabData = []
          return
        }
        const {data : result} = await this.$http.get(`categories/${this.cateId}/attributes`,{ params: {sel:this.activeName}})
        if (result.meta.status !== 200) return this.$message.error('获取参数列表失败')
        result.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTabData = result.data
        }else {
          this.onlyTabData = result.data
        }
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      addParams() {
        this.$refs.addFormRef.validate( async valid => {
          if (!valid) return
          const {data : result } = await this.$http.post(`categories/${this.cateId}/attributes/`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (result.meta.status !== 201) return  this.$message.error('添加参数失败')
          this.$message.success('添加参数成功')
          this.addDialogVisible = false
          this.getParamsData()
        })
      },
      editParams() {
        this.$refs.editFormRef.validate( async valid => {
          if (!valid) return
          const {data : result } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
          if (result.meta.status !== 200) return  this.$message.error('修改参数失败')
          this.$message.success('修改参数成功')
          this.editDialogVisible = false
          this.getParamsData()
        })
      },
      async showEditDialog(attr_id) {
        const {data : result} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {params: {attr_sel:this.activeName}})
        if (result.meta.status !== 200) return this.$message.error('获取参数信息失败')
        this.editForm = result.data
        this.editDialogVisible = true
      },
      removeParams(attr_id) {
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data : result} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          if (result.meta.status !== 200) return this.$message.error('删除参数失败')
          this.$message({
            type: 'success',
            message: '删除参数成功!'
          });
          this.getParamsData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }

        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttr(row)
      },
      showInput(row) {
        row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      async saveAttr(row) {
        const {data: result} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name : row.attr_name,
          attr_sel : row.attr_sel,
          attr_vals : row.attr_vals.join(' ')
        })
        if (result.meta.status !== 200) return this.$message.error('修改参数失败')
        this.$message.success('修改参数成功')
      },
      handleClose(index, row) {
        row.attr_vals.splice(index, 1)
        this.saveAttr(row)
      }
    }
  }
</script>

<style scoped>

</style>
