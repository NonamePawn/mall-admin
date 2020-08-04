<template>
  <div class="add">
    <!--面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" style="margin: 15px 0;" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab栏区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="50px" label-position="top">
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          @tab-click="tabClicked"
          :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="{
                    trigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                  }"
                  @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="subItem" v-for="(subItem, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" style="margin-top: 15px" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%">
      <img :src="previewPath" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Add",
    data() {
      return {
        activeIndex: '0',
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_cat: [],
          pics: [],
          goods_introduce: '',
          attrs:[]
        },
        previewDialogVisible: false,
        previewPath: '',
        cateList: [],
        manyTableData: [],
        onlyTableData: [],
        headerObj:{
          Authorization: window.sessionStorage.getItem('token')
        },
        uploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
        addFormRules: {
          goods_name: [
            {required: true, message:'请输入商品名称', trigger: 'blur'},
          ],
          goods_price: [
            {required: true, message:'请输入商品价格', trigger: 'blur'},
          ],
          goods_weight: [
            {required: true, message:'请输入商品重量', trigger: 'blur'},
          ],
          goods_number: [
            {required: true, message:'请输入商品数量', trigger: 'blur'},
          ],
          goods_cat: [
            {required: true, message:'请选择商品分类', trigger: 'blur'},
          ]
        },
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {data : result} = await this.$http.get('categories')
        if (result.meta.status !== 200) return this.$message.error('获取分类列表失败')
        this.cateList = result.data
      },
      handleChange() {
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      beforeTabLeave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },
      async tabClicked() {
        if (this.activeIndex === '1') {
          const {data:result} = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {params: {sel : 'many'}})
          if (result.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
          result.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          console.log(this.manyTableData);
          this.manyTableData = result.data
        }else if (this.activeIndex === '2') {
          const {data:result} = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {params: {sel : 'only'}})
          if (result.meta.status !== 200) return this.$message.error('获取静态属性列表失败')
          this.onlyTableData = result.data
        }

      },
      handlePreview(file) {
        this.previewPath = file.response.data.url
        this.previewDialogVisible = true
      },
      handleRemove(file) {
        const filePath = file.response.data.tmp_path
        const index = this.addForm.pics.findIndex(x=> x.pic === filePath )
        this.addForm.pics.splice(index, 1)
      },
      handleSuccess(response) {
        const picInfo = {pic : response.data.tmp_path}
        this.addForm.pics.push(picInfo)
      },
       add() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error('请填写必要的表单项')
          }
          let Form = JSON.parse(JSON.stringify(this.addForm));
          Form.goods_cat = Form.goods_cat.join(',')
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          Form.attrs = this.addForm.attrs
          const {data:result} = await this.$http.post('goods', Form)
          if (result.meta.status !== 201) return this.$message.error('添加商品失败')
          this.$message.success('添加商品成功')
          await this.$router.push('/goods')
        })
      }
    }
  }
</script>

<style scoped>

</style>
