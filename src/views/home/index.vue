<template>
  <div class="home-container">
    <div class="grid-row">
      <el-card>
        <div class="grid-content">
          <div class="left">
            <el-icon style="font-size: 24px; color: white"><user /></el-icon>
          </div>
          <div class="right">
            <div class="h2" style="color: #2d8cf0">
              <count-to :start-val="0" :end-val="5268" :duration="2000" :autoplay="true"></count-to>
            </div>
            <div>用户访问量</div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="grid-content">
          <div class="left" style="background: #64d572">
            <el-icon style="font-size: 24px; color: white"><user /></el-icon>
          </div>
          <div class="right">
            <div class="h2" style="color: #64d572">
              <count-to :start-val="0" :end-val="9599" :duration="2000" :autoplay="true"></count-to>
            </div>
            <div>系统消息</div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="grid-content">
          <div class="left" style="background: #f25e43">
            <el-icon style="font-size: 24px; color: white"><user /></el-icon>
          </div>
          <div class="right">
            <div class="h2" style="color: #f25e43">
              <count-to :start-val="0" :end-val="595453" :duration="2000" :autoplay="true"></count-to>
            </div>
            <div>数量</div>
          </div>
        </div>
      </el-card>
    </div>
    <el-card class="full-width-card">
      <div class="personal">
        <div class="online-status">
          <el-avatar :size="50" :src="AvatarLogo" />
          <h1
            >当前在线人数(活跃会话数)：<span class="online-number">{{ onlineNumber }}</span></h1
          >
        </div>
        <el-button type="primary" class="online-btn" @click="viewOnlineUsers">刷新在线用户信息</el-button>
        <el-table :data="onlineUsers">
          <el-table-column prop="userId" label="用户编号" sortable align="center" width="150" />
          <el-table-column prop="username" label="用户姓名" align="center" width="150" />
          <el-table-column prop="host" label="主机地址" align="center" width="300" />
          <el-table-column prop="region" label="登陆地址" align="center" width="300" />
          <el-table-column prop="startTimestamp" label="登陆时间" sortable align="center" width="500" />
          <el-table-column prop="lastAccessTime" label="最后访问时间" sortable align="center" width="500" />
          <el-table-column prop="sessionId" label="会话号" align="center" />
        </el-table>
        <el-divider></el-divider>
      </div>
    </el-card>

    <div class="half-width-row">
      <el-card class="box-card">
        <template #header>
          <div>
            <span>系列开源产品</span>
          </div>
        </template>
        <div style="display: flex">
          <el-card
            style="flex: 1; margin-right: 20px; cursor: pointer"
            class="card-item"
            @click="goTo('https://ext.dcloud.net.cn/plugin?id=7511')"
          >
            <div style="color: white; margin-bottom: 10px"><h3>zb-table</h3></div>
            <div style="font-size: 12px; color: white"
              >uniapp 表格组件
              支持固定表头和首列、上拉加载更多、及固定多列，表格自适应内容，排序，多选checkbox、可点击删除，编辑、合计功能，兼容多端</div
            >
          </el-card>
          <el-card style="flex: 1; cursor: pointer" class="card-item" @click="goTo('https://github.com/zouzhibin/vue-admin-perfect')">
            <div style="color: white; margin-bottom: 10px"><h3>vue-admin-perfect</h3></div>
            <div style="font-size: 12px; color: white">系统基于vue3+vuex+ element-plus+ts后台管理系统</div>
          </el-card>
        </div>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <div>
            <span>每周用户活跃量</span>
          </div>
        </template>
        <div>
          <bar-charts id="bar1" width="100%"></bar-charts>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { User } from '@element-plus/icons-vue'
  import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
  import AvatarLogo from '@/assets/image/avatar.png'
  import CountTo from '@/components/CountTo/index.vue'
  import BarCharts from '@/views/echarts/simple/components/bar.vue'
  import getWebSocket from '@/api/ws'
  import service from '@/api/request'

  const onlineNumber = ref()
  const onlineUsers = ref([])
  let ws
  onBeforeMount(() => {
    console.log('----创建')
    //使用websocket，创建对象时调用了连接connect()和onOpen()
    ws = getWebSocket(sessionStorage.getItem('sessionId'))
    //上线可以发消息给其他用户
    //ws.send('[' + roles.value + ']' + userInfo.value['name'] + ': 已上线')
    //回调监听
    // ws.onMessage(async messageEvent => {
    //   //如果session过期
    //   if(messageEvent.data === 'timeout'){
    //     await UserStore.logout()
    //     await router.push({ path: '/login' })
    //     ElNotification({
    //         title: getCurrentTime(),
    //         //dangerouslyUseHTMLString: true,
    //         message: '您长时间未操作，会话已过期，请重新登录',
    //         type: 'error',
    //         offset: 200,
    //         duration: 5000,
    //       })
    //   }else if(messageEvent.data === 'login'){
    //     console.log('@@@@@@@@@@@有人登录', messageEvent.data)
    //   }else if(messageEvent.data === 'logout'){
    //     console.log('@@@@@@@@@@@有人下线', messageEvent.data)
    //   }else{
    //     emitter.emit('getOnlineNumber', messageEvent.data)
    //     console.log('当前在线人数', messageEvent.data)
    //   }
    // })
    ws.onMessage((messageEvent) => {
      onlineNumber.value = messageEvent.data
    })
    viewOnlineUsers()
  })

  const viewOnlineUsers = () => {
    service({
      method: 'get',
      url: 'base/user/online',
    }).then((res) => {
      if (res.data.code === 0) {
        onlineUsers.value = res.data.onlineUserList
      }
    })
  }
  const goTo = (url) => {
    window.open(url, '_blank')
  }

  onUnmounted(() => {
    if (ws) {
      ws.close()
    }
  })
</script>

<style scoped lang="scss">
  @import './index';
</style>
