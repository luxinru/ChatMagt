
<template>
  <div class="page_root">
    <div class="header">
      <span class="left"> Android 设备管理平台 </span>

      <div class="info">
        <img
          v-if="isAdmin"
          class="chart"
          src="@/assets/24gf-chartBarUpward.png"
          alt=""
          @click="isShowChart = true"
        />

        <el-badge :value="newMgsList.length" class="item">
          <el-icon color="#21aa93" size="24px" @click="onOpenMsg">
            <ChatLineSquare />
          </el-icon>
        </el-badge>

        <el-popover placement="bottom" :width="100" trigger="click">
          <template #reference>
            <span>{{ username }}</span>
          </template>

          <div class="exit" @click="onExit">退出登陆</div>
        </el-popover>
      </div>
    </div>

    <div class="container">
      <div class="chats">
        <div class="chat_header">
          <template v-if="isAdmin">
            <el-select
              v-model="value"
              clearable
              class="elselect"
              placeholder="所有设备"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>

          <template v-else>
            <span class="elselect">
              {{ options[0]?.device_name || '暂无设备' }}
            </span>
          </template>

          <div class="btn" @click="isShowDialogForm = true">新建短信</div>
        </div>
        <el-input
          v-model="searchInput"
          class="elinput"
          placeholder="请输入关键字"
          :prefix-icon="Search"
        />

        <div class="tip">
          <span>最近联系人</span>
          <el-icon @click="onRefres"><Refresh /></el-icon>
        </div>

        <div class="chat_container">
          <div
            v-for="(item, index) in formatList"
            :key="index"
            class="item"
            :class="{ active: currentContract.address === item.address }"
            @click="onContractClick(item)"
          >
            <el-avatar class="avatar" :size="50" :src="img" />
            <div class="info">
              <span> {{ item.address }}（{{ item.child.length }}） </span>
              <span>{{ item.child[0].body }}</span>
              <span>
                {{
                  moment(Number(item.child[0].date)).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="content_container">
          <template v-if="currentContract.child?.length">
            <div class="content_header">
              <el-avatar class="avatar" :size="40" :src="img" />
              <span class="name"> {{ currentContract.address }} </span>
            </div>

            <div class="content_chat">
              <div
                class="item"
                v-for="(item, index) in currentContract.child"
                :key="index"
                :class="{ fanzhuan: item.type === '2' }"
              >
                <el-avatar
                  v-if="!(item.type === '2')"
                  class="avatar"
                  :size="26"
                  :src="img"
                />
                <div class="info">
                  <span class="name">
                    {{ item.type === '2' ? '' : item.address }}
                    ,
                    {{
                      moment(Number(item.date)).format('YYYY-MM-DD HH:mm:ss')
                    }}
                    <img src="@/assets/fasongchenggong.png" alt="" />
                  </span>

                  <div class="info_chat">
                    {{ item.body }}

                    <div class="translate">
                      <span v-if="!item.trans" @click="onTranslate(item)">
                        翻译
                      </span>
                      <p v-else>
                        {{ item.trans }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="content_footer">
          <el-input v-model="input" placeholder="请输入内容" size="large">
            <template #suffix>
              <span
                style="color: #21aa93; cursor: pointer"
                @click="onTranslateInput"
                >翻译</span
              >
            </template>
          </el-input>
          <el-button
            class="btn"
            type="primary"
            size="large"
            :disabled="!currentContract.child?.length"
            @click="onSendMsg"
          >
            发送
          </el-button>
        </div>
      </div>
    </div>

    <el-drawer v-model="isShowDrawer" :with-header="false" class="drawer">
      <div class="drawer_container">
        <div class="item" v-for="(item, index) in newMgsList" :key="index">
          <div class="item_header">
            <span>{{ item.sms.address }}</span>
            <span>
              {{ moment(Number(item.sms.date)).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </div>
          <div class="item_content">
            【{{ item.device_name }}】 {{ item.sms.body }}
          </div>
        </div>

        <div class="drawer_footer">
          <el-button
            class="btn"
            type="primary"
            size="large"
            style="width: 100%"
            @click="onClearMsg"
          >
            清空
          </el-button>
        </div>
      </div>
    </el-drawer>

    <el-dialog v-model="isShowDialogForm" title="发送短信" style="width: 600px">
      <el-form :model="form" label-width="70px">
        <el-form-item label="安卓设备">
          <el-select
            v-model="form.device"
            clearable
            placeholder="请选择安卓设备"
            style="width: 100%"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="对方号码">
          <el-input
            v-model="form.phone"
            clearable
            autocomplete="off"
            placeholder="多个号码用#号分开"
          />
        </el-form-item>
        <el-form-item label="短信内容">
          <el-input
            v-model="form.content"
            clearable
            type="textarea"
            resize="none"
            :rows="5"
            autocomplete="off"
            placeholder="请输入短信内容"
          />
        </el-form-item>
        <el-form-item label="">
          <span
            style="color: #21aa93; cursor: pointer"
            @click="onTranslateInput2"
            >翻译</span
          >
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowDialogForm = false">取消</el-button>
          <el-button type="primary" @click="onSendMsgs"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer
      v-model="isShowChart"
      custom-class="chart_drawer"
      title="数据统计"
      direction="ttb"
      size="100%"
    >
      <div class="chart_drawer_container">
        <el-select
          v-model="sort"
          size="large"
          style="width: max-content"
          @change="initChart"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div id="chart" class="chart"></div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import {
  ElMessageBox,
  ElMessage,
  ElLoading,
  ElNotification
} from 'element-plus'
</script>

<script>
import { getDeviceList } from '@/api'
import { groupBy, orderBy } from 'lodash'
import moment from 'moment'
import * as echarts from 'echarts'
import axios from 'axios'

export default {
  name: 'Home',

  data () {
    return {
      searchInput: '',
      sort: 1,
      sortOptions: [
        {
          value: 1,
          label: '按打招呼排序'
        },
        {
          value: 2,
          label: '按收到回复排序'
        }
      ],
      form: {
        device: '',
        phone: '',
        content: ''
      },
      isShowDialogForm: false,
      isShowDrawer: false,
      isShowChart: false,
      input: '',
      value: '',
      options: [],
      socket: null,
      list: [],
      currentContract: {},
      img: require('@/assets/3ea6beec64369c2642b92c6726f1epng.png'),
      newMgsList: [],
      refreshIndex: 0,
      refreshMgsIndex: 0,
      loading: null
    }
  },

  computed: {
    formatList () {
      const mergedData = {}

      // 遍历数据数组，按名称合并所有数据
      for (const d of this.list) {
        if (!mergedData[d.address]) {
          mergedData[d.address] = []
        }
        mergedData[d.address].push(d)
      }

      // 对合并后的数据进行转换和排序
      const sortedResult = Object.entries(mergedData)
        .map(([address, values]) => ({
          address,
          deviceId: values[0].device_id,
          child: values.sort(
            (a, b) => new Date(Number(b.date)) - new Date(Number(a.date))
          )
        }))
        .sort((a, b) => {
          const aDate = new Date(Number(a.child[0].date))
          const bDate = new Date(Number(b.child[0].date))
          return bDate - aDate
        })

      // 按照子元素的日期排序
      sortedResult.sort(
        (a, b) =>
          new Date(Number(b.child[0].date)) - new Date(Number(a.child[0].date))
      )

      return sortedResult
        .filter((item) => item.address.indexOf(this.searchInput) > -1)
        .filter((item) => item.deviceId.indexOf(this.value) > -1)
    },

    username () {
      return this.$route.query.username
    },

    isAdmin () {
      return this.username === 'admin'
    }
  },

  watch: {
    isShowChart () {
      if (this.isShowChart) {
        this.$nextTick(() => {
          this.initChart()
        })
      }
    }
  },

  created () {
    const ip = location.host
    this.socket = new WebSocket(
      `ws://${ip}/socket.io/?EIO=4&transport=websocket`
    )
  },

  async mounted () {
    await this.init()
    // 监听WebSocket连接打开事件
    this.socket.addEventListener('open', (event) => {
      console.log('WebSocket连接已打开')
    })

    // 监听WebSocket连接关闭事件
    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket连接已关闭')
    })

    this.socket.addEventListener('message', (event) => {
      // 收到了一条消息
      const str = event.data
      /**
       * 首次反馈
       */
      if (str.indexOf('0{"sid"') > -1 && str.indexOf('40{"sid"') === -1) {
        this.socket.send('40')
      } else if (str.indexOf('40{"sid"') > -1) {
        /**
         * 获取最近消息
         */
        this.reSendMgs()
      } else if (str === '2') {
        /**
         * 保持连接
         */
        this.socket.send('3')
      } else if (str.indexOf('42["web",{"sms"') > -1) {
        /**
         * 新消息
         */
        const dataStr = event.data.substr(2, event.data.length)
        const data = JSON.parse(dataStr)
        if (this.isAdmin) {
          if (data[1].sms) {
            this.newMgsList.push(data[1])

            ElNotification({
              title: '新消息通知',
              message: `<strong>设备:</strong> <span>${data[1].device_name}</span><br/><strong>号码:</strong> <span>${data[1].sms.address}</span><br/><strong>内容:</strong> <span>${data[1].sms.body}</span>`,
              duration: 10000,
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
            this.reSendMgs()
          }
        } else {
          if (data[1].sms && data[1].device_id === this.username) {
            this.newMgsList.push(data[1])

            ElNotification({
              title: '新消息通知',
              message: `<strong>设备:</strong> <span>${data[1].device_name}</span><br/><strong>号码:</strong> <span>${data[1].sms.address}</span><br/><strong>内容:</strong> <span>${data[1].sms.body}</span>`,
              duration: 10000,
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
            this.reSendMgs()
          }
        }
      } else if (str.indexOf('[') === 9) {
        /**
         * 最新数据
         */
        const dataStr = event.data.substr(9, event.data.length)
        const data = JSON.parse(dataStr)
        this.formatData(data[1])
      }
    })
  },

  beforeUnmount () {
    this.socket.close()
  },

  methods: {
    moment,

    async onTranslateInput () {
      if (!this.input) {
        return ElMessage({
          message: '请输入内容',
          type: 'warning'
        })
      }
      const text = await this.translateFun(this.input, '英文')
      this.input = text
    },

    async onTranslateInput2 () {
      if (!this.form.content) {
        return ElMessage({
          message: '请输入内容',
          type: 'warning'
        })
      }
      const text = await this.translateFun(this.form.content, '英文')
      this.form.content = text
    },

    onClearMsg () {
      this.newMgsList = []
      this.isShowDrawer = false
    },

    onSendMsgs () {
      if (!this.form.device) {
        return ElMessage({
          message: '请选择设备',
          type: 'warning'
        })
      }

      if (!this.form.phone) {
        return ElMessage({
          message: '请输入手机号',
          type: 'warning'
        })
      }

      if (!this.form.content) {
        return ElMessage({
          message: '请输入内容',
          type: 'warning'
        })
      }
      this.sendMsg(this.form.phone, this.form.device, this.form.content)
      this.form = {
        device: '',
        phone: '',
        content: ''
      }
      this.isShowDialogForm = false
    },

    onSendMsg () {
      this.sendMsg(
        this.currentContract.address,
        this.currentContract.deviceId,
        this.input
      )
      this.input = ''
      this.refreshIndex = 0
      this.refreshMgsIndex = 0
    },

    reSendMgs () {
      // this.list = []
      const date = new Date()
      this.socket.send(
        `42["web->android",{"type":"recent-sms","timestamp":"${
          date.getTime() / 1000
        }","device":"web"},null]`
      )
    },

    sendMsg (phones, deviceId, msg) {
      this.loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const arr = phones.split('#')

      arr.forEach((item) => {
        const date = new Date()
        this.socket.send(
          `42["web->android",{"type":"send-sms","timestamp":"${
            date.getTime() / 1000
          }","device":"web", "body": "${msg}", "address": "${item}", "device_id": "${deviceId}"},null]`
        )
      })

      ElMessage({
        message: '发送消息任务下发成功',
        type: 'success'
      })

      this.reSendMgs()
    },

    initChart () {
      const obj = groupBy(this.list, 'address')
      let arr = []

      for (const key in obj) {
        const element = obj[key]

        const tempArr = element.filter((item) => item.type === '2')
        arr.push({
          name: key,
          reply: tempArr.length || 0,
          greet: element.length - tempArr.length
        })
      }

      if (this.sort === 1) {
        arr = orderBy(arr, 'greet', 'desc')
      } else {
        arr = orderBy(arr, 'reply', 'desc')
      }

      echarts.dispose(document.getElementById('chart'))
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('chart'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 0
        },
        xAxis: [
          {
            type: 'value',
            min: 0,
            position: 'top',
            minInterval: 1
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: arr.map((item) => item.name),
            inverse: true
          }
        ],
        dataZoom: [
          {
            show: arr.length > 4,
            right: '3%',
            width: 16,
            startValue: 0,
            endValue: 4,
            maxValueSpan: 4,
            brushSelect: false, // 是否开启刷选功能
            orient: 'vertical',
            backgroundColor: 'transparent',
            showDataShadow: false,
            fillerColor: 'rgba(64, 83, 133, 0.8)',
            zoomLock: true
          },
          {
            zoomLock: true, // 这个开启之后只能通过鼠标左右拉动，不能滚动显示
            type: 'inside',
            orient: 'vertical'
          }
        ],
        series: [
          {
            name: '打招呼数',
            type: 'bar',
            barWidth: 40,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#35EB81' },
                { offset: 1, color: 'rgba(53,235,129,.2)' }
              ])
            },
            data: arr.map((item) => item.greet)
          },
          {
            name: '收到回复数',
            type: 'bar',
            barWidth: 40,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#32C1FF' },
                { offset: 1, color: 'rgba(17,75,183,0.20)' }
              ])
            },
            data: arr.map((item) => item.reply)
          }
        ]
      })
    },

    generateSalt (length) {
      var chars =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var salt = ''
      for (var i = 0; i < length; i++) {
        salt += chars[Math.floor(Math.random() * chars.length)]
      }
      return salt
    },

    async onTranslate (data) {
      const text = await this.translateFun(data.body)
      this.currentContract.child.forEach((item) => {
        if (item.address === data.address && item.date === data.date) {
          // this.$set(item, 'trans', text)
          item.trans = text
        }
      })
    },

    async translateFun (text, lang = '中文') {
      const apiKey = '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' // 你的key

      const client = axios.create({
        headers: {
          Authorization: 'Bearer ' + apiKey
        }
      })
      const params = {
        prompt: `翻译成${lang}：${text}`,
        model: 'text-davinci-003',
        max_tokens: 2048,
        temperature: 0
      }
      // post请求
      const res = await client.post(
        'https://api.openai.com/v1/completions',
        params
      )

      console.log(res.data.choices[0].text)
      return res.data.choices[0].text
    },

    onRefres () {
      this.reSendMgs()
      ElMessage({
        message: '刷新成功',
        type: 'success'
      })
    },

    onContractClick (contract) {
      this.currentContract = contract
    },

    formatData (obj) {
      const listArr = this.isAdmin
        ? obj.data
        : obj.data.filter((item) => item.device_id === this.username)
      const dataList = listArr.map((item) => {
        return {
          ...item,
          device_id: obj.device_id
        }
      })

      const arr = []
      dataList.forEach(item => {
        const fined = this.list.find(element => element.body === item.body && element.date === item.date)
        if (!fined) {
          arr.push(item)
        }
      })
      this.list = this.list.concat(arr)

      if (this.currentContract.child?.length) {
        const arr = this.list.filter(
          (item) => item.address === this.currentContract.address
        )
        const dateArr = this.currentContract.child?.map((item) => item.date)
        const list = this.currentContract.child?.concat(
          arr.filter((item) => dateArr.indexOf(item.date) === -1)
        )
        this.currentContract.child = orderBy(list, 'date', 'desc')
      }

      this.refreshMgsIndex += 1

      if (this.refreshMgsIndex === this.options.length) {
        if (this.refreshIndex < 4) {
          this.refreshIndex += 1
          this.refreshMgsIndex = 0
          this.reSendMgs()
        } else {
          this.refreshIndex = 0
          this.refreshMgsIndex = 0
          if (this.loading) {
            this.loading.close()
          }
        }
      }
    },
    async init () {
      const res = await getDeviceList()
      this.options = []
      if (res.status) {
        const list =
          this.username === 'admin'
            ? res.data
            : res.data.filter((item) => item.device_id === this.username)
        this.options = list.map((item) => {
          return {
            value: item.device_id,
            label: item.device_name,
            ...item
          }
        })
      }
    },
    onOpenMsg () {
      this.isShowDrawer = true
    },

    onExit () {
      ElMessageBox.confirm('退出登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>

<style lang="less">
.exit {
  width: 100%;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style lang="less" scoped>
.page_root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .chart_drawer {
    display: flex;
    flex-direction: column;

    .chart_drawer_container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .chart {
        width: 100%;
        flex: 1 0;
        margin-top: 1rem;
      }
    }
  }

  .header {
    width: 100%;
    height: 50px;
    flex-shrink: 0;
    background-color: #f5f5f5;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      color: #21aa93;
      font-size: 20px;
      font-weight: 700;
    }

    .info {
      display: flex;
      align-items: center;

      .chart {
        height: 22px;
        margin-right: 1rem;
        margin-bottom: 5px;
        cursor: pointer;
      }

      i {
        cursor: pointer;
      }

      span {
        margin-left: 40px;
        cursor: pointer;
      }
    }
  }

  .container {
    width: 100%;
    flex: 1 0;
    display: flex;
    overflow: hidden;

    .chats {
      width: 351px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 24px 24px;
      background-color: #f5f5f5;

      .chat_header {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .elselect {
          min-width: 100px;

          /deep/ .el-input__wrapper {
            background-color: transparent;
            border: none;
            box-shadow: none !important;
            padding: 0;
            overflow: hidden;
          }

          /deep/ input {
            // position: absolute;
            flex: 1 0;
            max-width: 150px;
            font-size: 16px;
          }
        }

        .btn {
          background-color: #181717;
          color: #fff;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 0.25rem;
        }
      }

      .tip {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #606266;
        font-size: 15px;

        i {
          cursor: pointer;
        }
      }

      .chat_container {
        width: 100%;
        flex: 1 0;
        display: flex;
        flex-direction: column;
        overflow-y: auto;

        // &::-webkit-scrollbar {
        //   display: none;
        // }

        .item {
          width: 100%;
          padding: 16px;
          background-color: #fff;
          margin-bottom: 4px;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          border: 1px solid #fff;
          display: flex;
          align-items: center;
          overflow: hidden;

          &:hover {
            border: 1px solid #21aa93;
            text-decoration: none;
          }

          .avatar {
            margin-right: 1rem;
          }

          .info {
            flex: 1 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            span {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              &:first-child {
                color: #555555;
                font-size: 1rem;
                margin-bottom: 0.25rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
              }

              &:nth-child(2) {
                font-size: 14px;
                color: #626569;
                margin-bottom: 0.25rem;
              }

              &:last-child {
                font-size: 12px;
                color: #95aac9;
              }
            }
          }
        }

        .active {
          border: 1px solid #21aa93;
          text-decoration: none;
        }
      }
    }

    .content {
      flex: 1 0;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .content_container {
        flex: 1 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .content_header {
          width: 100%;
          border-bottom: 1px solid #f5f5f5;
          padding: 1.5rem 3rem;
          display: flex;
          align-items: center;

          .avatar {
            margin-right: 1rem;
          }

          .name {
            flex: 1 0;
            height: 40px;
            display: flex;
            align-items: center;
            font-size: 1rem;
            color: #555555;
            font-weight: 500;
          }
        }

        .content_chat {
          width: 100%;
          flex: 1 0;
          overflow-y: scroll;
          padding: 0 3rem 1rem;
          display: flex;
          flex-direction: column-reverse;

          &::-webkit-scrollbar {
            display: none;
          }

          .item {
            margin-top: 10px;
            display: flex;
            width: 60%;

            .avatar {
              margin-right: 0.5rem;
            }

            .info {
              width: max-content;
              display: flex;
              flex-direction: column;

              .name {
                font-size: 12px;
                color: #95aac9;
                margin: 0 0 5px;
                display: flex;
                align-items: center;

                img {
                  height: 12px;
                  margin-left: 5px;
                }
              }

              .info_chat {
                width: max-content;
                background-color: #f5f5f5;
                max-width: 100%;
                min-width: 10%;
                border-radius: 0 15px 15px 15px;
                font-size: 16px;
                padding: 1rem;
                color: #626569;

                .translate {
                  width: 100%;
                  border-top: 1px solid rgba(98, 101, 105, 0.3);
                  margin-top: 10px;
                  padding-top: 10px;
                  span {
                    font-size: 12px;
                    color: #21aa93;
                    cursor: pointer;
                  }

                  p {
                    padding: 0;
                    margin: 0;
                  }
                }
              }
            }
          }

          .fanzhuan {
            flex-direction: row-reverse;
            align-self: flex-end;

            .avatar {
              margin-right: 0;
              margin-left: 1rem;
            }

            .info {
              .name {
                justify-content: flex-end;
              }
              .info_chat {
                align-self: flex-end;
                border-radius: 15px 0 15px 15px;
              }
            }
          }
        }
      }

      .content_footer {
        padding: 1.5rem 3rem;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;

        .btn {
          margin-left: 1rem;
        }

        /deep/ .el-button {
          background-color: #21aa93;
        }
      }
    }
  }

  .drawer {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .drawer_container {
      position: relative;
      width: 100%;
      height: 100%;
      padding-bottom: calc(40px + 1rem);
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      .item {
        padding: 0 0 1rem;
        display: flex;
        flex-direction: column;
        margin-top: 1rem;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          border-bottom: none;
        }

        .item_header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            &:first-child {
              font-weight: bold;
              font-size: 14px;
              color: #000;
            }

            &:last-child {
              color: #95aac9;
              font-size: 12px;
            }
          }
        }

        .item_content {
          margin-top: 0.5rem;
          font-size: 14px;
          color: #626569;
        }
      }

      .drawer_footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 1rem 0 0;
      }
    }
  }
}
</style>
