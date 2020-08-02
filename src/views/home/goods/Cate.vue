<template>
  <div class="category">
    <!--面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <el-row style="margin-bottom: 15px">
        <el-col>
          <el-button type="primary" @click="showAddCatDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false">
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-error" style="color: red" v-if="scope.row.cat_delete"></i>
          <i class="el-icon-success" style="color: lightgreen" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template slot="OP" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--分页区域-->
      <el-pagination
        style="margin-top: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--修改用户的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      width="50%"
      @close="addCatDialogClosed">
      <el-form :model="addCatForm" :rules="addCatFormRules" ref="addCatFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name" ></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            style="width: 100%"
            v-model="selectedKeys"
            :options="parentCatList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true
            }"
            clearable
            @change="ParentCatChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCatDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCat">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Cate",
    data() {
      return {
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        cateList: [],
        total: 0,
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isOk'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'OP'
          }
        ],
        addCatDialogVisible: false,
        addCatForm: {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0
        },
        addCatFormRules: {
          cat_name: [
            { required: true, message:'请输入分类名称', trigger: 'blur'}
          ]
        },
        parentCatList: [],
        selectedKeys: [],
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {data : result} = await this.$http.get('categories', {params: this.queryInfo})
        if (result.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.cateList = result.data.result
        this.total = result.data.total
      },
      handleSizeChange(newValue){
        this.queryInfo.pagesize = newValue
        this.getCateList()
      },
      handleCurrentChange(newValue){
        this.queryInfo.pagenum = newValue
        this.getCateList()
      },
      showAddCatDialog() {
        this.getParentCatList()
        this.addCatDialogVisible = true
      },
      async getParentCatList() {
        const {data : result} = await this.$http.get('categories', {params: {type : 2}})
        if (result.meta.status !== 200) return this.$message.error('获取父级分类失败')
        this.parentCatList = result.data
      },
      ParentCatChanged() {
        if (this.selectedKeys.length > 0){
          this.addCatForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          this.addCatForm.cat_level = this.selectedKeys.length
        }else {
          this.addCatForm.cat_pid =  0
          this.addCatForm.cat_level = 0
        }

      },
      addCat() {
        this.$refs.addCatFormRef.validate(async vaild => {
          if (!vaild) return
          const {data : reuslt} = await this.$http.post('categories', this.addCatForm)
          if (reuslt.meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
          this.getCateList()
          this.addCatDialogVisible = false
        })
      },
      addCatDialogClosed() {
        this.$refs.addCatFormRef.resetFields()
        this.selectedKeys = []
        this.addCatForm.cat_pid =  0
        this.addCatForm.cat_level = 0
      }
    }
  }
</script>

<style scoped>

</style>
