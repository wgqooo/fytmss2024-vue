<template>
  <div>
    <h1>
      当前在线用户数量: <span style="color: red; margin-right: 20px">{{ onlineCount }}</span>
    </h1>
  </div>
</template>

<script setup lang="ts" name="websocket">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useUserStore } from '@/store/modules/user'

  const onlineCount = ref(0)
  const UserStore = useUserStore()
  let ws: WebSocket

  // const queryOnlineCount = () => {
  //   if (ws && ws.readyState === WebSocket.OPEN) {
  //     // 发送一个特殊的消息请求最新的在线人数
  //     ws.send(JSON.stringify({ type: 'request_online_count' }));
  //   } else {
  //     console.log('WebSocket is not open');
  //   }
  // };
  onMounted(() => {
    console.log(UserStore.token)
    ws = new WebSocket('ws://localhost:9091/api/webSocket/' + UserStore.token)

    ws.onmessage = (event) => {
      console.log('received msg: ', event.data)
      //onlineCount.value = event.data
    }
    ws.onopen = () => {
      console.log('WebSocket connection established')
    }
    ws.onclose = () => {
      //onlineCount.value--
      console.log('WebSocket connection closed')
    }
    ws.onerror = (error) => {
      console.error('WebSocket error: ', error)
    }
  })

  onUnmounted(() => {
    if (ws) {
      ws.close()
    }
  })
</script>

<style scoped></style>
