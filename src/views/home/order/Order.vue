<template>
  <div class="order">
    <!--面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-table :data="orderList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"></el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template slot-scope="scope">
              {{scope.row.create_time | dataFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
              <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </el-row>
    </el-card>
    <el-dialog
      title="修改地址"
      @close="addressDialogClosed"
      :visible.sync="addressDialogVisible"
      width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-input v-model="addressForm.address1"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in progressInfo" :key="index" :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Order",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        total: 0,
        orderList: [],
        addressDialogVisible: false,
        progressDialogVisible: false,
        progressInfo: [],
        addressForm: {
          address1: [],
          address2: '',
        },
        addressFormRules: {
          address1: [
            {required: true, message:'请选择省市区县', trigger: 'blur'}
          ],
          address2: [
            {required: true, message:'请填写详细地址', trigger: 'blur'}

          ]
        }
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      async getOrderList() {
        const {data:result} = await this.$http.get('orders', {params: this.queryInfo})
        if (result.meta.status !== 200) return this.$message.error('获取订单列表失败')
        this.orderList = result.data.goods
        this.total = result.data.total
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      showBox() {
        this.addressDialogVisible = true
      },
      addressDialogClosed() {
        this.$refs.addressFormRef.resetFields()
      },
      async showProgressBox() {
        const {data:result} = await this.$http.get('kuaidi/804909574412544580')
        if (result.meta.status !== 200) return this.$message.error('获取物流信息失败')
        this.progressInfo = result.data
        this.progressDialogVisible = true
      }
    }
  }
</script>

<style scoped>

</style>
