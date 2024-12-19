<template>
  <el-drawer v-model="dialogVisible" size="20%" @close="close">
    <template #header>
      <div class="drawer-title">
        <el-tag size="large">修改权限</el-tag>
      </div>
    </template>
    <template #default>
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleCname">
          <el-tag :style="{ color: '#409eff', fontSize: '16px', 'font-weight': 'bold' }">{{ ruleForm.roleCname }}</el-tag>
        </el-form-item>
        <el-form-item label="角色标识" prop="roleEname">
          <el-tag :style="{ color: '#e6a23c', fontSize: '16px', 'font-weight': 'bold' }">{{ ruleForm.roleEname }}</el-tag>
        </el-form-item>
        <!--使用default-expanded-keys和default-checked-keys设置初始展开和复选框状态
        default-checked-keys 在组件初始化时只读取了一次 menuIds 的值，
        check-strictly属性设置为true，复选框的勾选严格的遵循父子不互相关联
        并将其作为默认勾选节点，后续 menuIds 的变化不会影响已经设置的勾选状态。
        show-checkbox属性：节点是否可被选择
  	    @check-change（当复选框被点击的时候触发）:共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、
        节点本身是否被选中、节点的子树中是否有被选中的节点，
        @check（点击节点复选框之后触发）：共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象-->
        <el-form-item label="菜单权限">
          <el-tree ref="tree" :data="asyncRoutes" show-checkbox node-key="menuId" highlight-current>
            <template #default="{ node, data }">
              <span>
                <span>
                  <el-icon v-if="data.meta.icon"> <component :is="data.meta?.icon"></component></el-icon>
                  <svg-icon v-else :icon-class="data.meta.svg" />
                  {{ data.meta.title }}
                </span>
              </span>
            </template>
          </el-tree>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClose">确定</el-button>
      </span>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { asyncRoutes } from '@/routers/index'
  import service from '@/api/request'

  const dialogVisible = ref(false)
  const tree = ref(null)
  //const checkStrictly = ref(true)
  const ruleForm = reactive({
    roleId: '',
    roleCname: '',
    roleEname: '',
  })
  const props = defineProps({
    getData: {
      type: Function,
    },
    clearTreeStatus: {
      type: Function,
    },
  })

  function close() {
    Object.keys(ruleForm).forEach((key) => {
      if (key === 'status') ruleForm[key] = true
      else ruleForm[key] = null
    })
    //checkStrictly.value = true
    props.clearTreeStatus(tree.value)
  }

  const show = (item = {}) => {
    Object.keys(item).forEach((key) => {
      ruleForm[key] = item[key]
    })
    dialogVisible.value = true
  }

  function settingTreeOpt(parentIds, menuIds) {
    parentIds.forEach((menuId) => {
      tree.value.getNode(menuId).expanded = true
    })
    if (tree.value) {
      tree.value.setCheckedKeys(menuIds)
    }
  }

  const handleClose = async () => {
    /*
      tree.value.getCheckedKeys():获取被选中的节点的key数组
      这里把要赋予权限的角色roleId也放进同一个数组，方便接收
      如果子菜单的节点没有全部被选中，那么父菜单的menuId不会出现在getCheckedKeys()。
      然而没有父菜单的权限，就不能访问子菜单
    */
    ElMessageBox.confirm(
      `确认修改 <span style="color: red; font-size: 18px; font-weight: bold">${ruleForm.roleCname}</span> 的菜单权限吗？`,
      '考虑一下',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', dangerouslyUseHTMLString: true },
    )
      .then(() => {
        let arr = []
        tree.value.getCheckedKeys().forEach((menuId) => {
          arr.push(menuId)
          let parentId = tree.value.getNode(menuId).data.parentId
          if (parentId && !arr.includes(parentId)) {
            arr.push(parentId)
          }
        })
        arr.push(ruleForm.roleId)
        service({
          method: 'post',
          url: 'sys/auth/addAuth',
          data: arr,
        }).then((response) => {
          if (response.data.code === 0) {
            ElMessage({
              type: 'success',
              message: `权限更新成功!<span style="color: red; font-size: 18px; font-weight: bold"> 刷新浏览器生效</span>`,
              dangerouslyUseHTMLString: true,
            })
          }
        })
        dialogVisible.value = false
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '权限修改失败',
        })
      })
  }

  defineExpose({
    show,
    settingTreeOpt,
  })
</script>

<style lang="scss" scoped>
  .drawer-title {
    font-weight: bolder;
  }
  // :deep(.el-tree-node__expand-icon) {
  //   position: absolute;  //设置倒三角的位置  目前我设置的是让倒三角在右侧显示
  //   //right: 6%;
  // }
  //一级节点选择器
  :deep(.el-tree-node .el-tree-node__content) {
    background-image: linear-gradient(to right, rgba(0, 136, 210, 0.2), rgba(0, 25, 46, 0.2));
    font-weight: bold;
    border-radius: 1px;
    color: #409eff;
    font-size: 20px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 120px;
  }
  :deep(.el-tree-node__content > label.el-checkbox) {
    margin-left: 10px; //checkbox 距离左侧的位置
    margin-right: 15px;
  }
  //二级节点选择器
  :deep(.el-tree-node .el-tree-node__children .el-tree-node .el-tree-node__content) {
    margin: 0px !important;
    font-weight: 100;
    padding-right: 0px;
    background-image: linear-gradient(to right, rgba(238, 227, 227, 0.5), rgba(0, 234, 255, 0.418)) !important;
    //设置二级节点渐变背景颜色透明度为20%
  }
  // :deep(.el-tree-node .el-tree-node__children .el-tree-node .el-tree-node__content .el-tree-node__label){
  //   font-size: 10px; //设置二级节点文字大小
  //   color: #058a7f;//设置二级节点文字颜色
  // }
  :deep(.el-tree-node .el-tree-node__children .el-tree-node .el-tree-node__content .el-checkbox__inner) {
    width: 14px; //设置二级节点checkbox大小
    height: 14px;
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background: rgb(253, 173, 0); //修改选中时checkbox背景颜色
    &::after {
      border-color: #002237; //修改checkbox对钩颜色
    }
  }
  // :deep(.el-tree-node__expand-icon) {
  //   color: #0095A8;  //修改el-tree树结构自带的三角图标的颜色
  // }
  //修改el-tree树结构自带的三角图标的颜色,之后会出现一个问题,
  //会将叶子节点(没有子节点的)也给添加了三角图标,
  //审查元素发现所有节点的图标都带有一样的类名,
  //只要修改样式就会更改所有图标,不管是否是叶子节点.
  //所以还要加上下面的代码,隐藏叶子节点的三角图标才能行.
  // :deep(.el-tree-node__expand-icon.is-leaf::before) {
  //   display: none;
  // }
</style>
