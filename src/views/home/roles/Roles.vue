<template>
  <div class="roles">
    <!--面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row style="margin-bottom: 15px">
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
                    v-for="(item, index) in scope.row.children" :key="item.id">
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item, index) in item.children" :key="item.id"
                        :class="[index === 0 ? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" color="" closable @close="removeRight(scope.row, item.id)">{{item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="removeRight(scope.row, item.id)" closable type="warning" v-for="(item, index) in item.children" :key="item.id">{{item.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分配用户权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose">
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        show-checkbox node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allCheckRight">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        rolesList: [],
        setRightDialogVisible: false,
        rightsList: [],
        treeProps: {
          label: 'authName',
          children : 'children'
        },
        defaultKeys: [],
        roleID: ''
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      async getRolesList() {
        const {data : result} = await this.$http.get('roles')
        if (result.meta.status !== 200) return this.$message.error({duration:1000, message:"获取角色列表失败"})
        this.rolesList = result.data
      },
      removeRight(role, rightId) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          const {data : result} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          console.log(result);
          if (result.meta.status !== 200) return this.$message.error('删除权限失败');
          role.children = result.data
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      async showSetRightDialog(role) {
        this.roleID = role.id
        const {data : result} = await this.$http.get('rights/tree')
        if (result.meta.status !== 200) return this.$message.error('获取权限树失败')
        this.rightsList = result.data
        this.getDefaultKeys(role, this.defaultKeys)
        this.setRightDialogVisible = true
      },
      getDefaultKeys(node, array) {
        if (!node.children) {
          return array.push(node.id)
        }else {
          node.children.forEach( item => {
            this.getDefaultKeys(item, array)
          })
        }
      },
      setRightDialogClose() {
        this.defaultKeys = []
      },
      async allCheckRight() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const IDStr = keys.join(',')
        const {data : result} = await this.$http.post(`roles/${this.roleID}/rights`, { rids : IDStr})
        console.log(result);
        if (result.meta.status !== 200) return this.$message.error('授予权限失败')
        this.$message.success('授予权限成功')
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    }
  }
</script>

<style scoped>
  .bdtop {
  border-top: 1px solid #eeeeee;
}

  .bdbottom {
    border-bottom: 1px solid #eeeeee;
  }

  .el-tag {
    margin: 7px;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
