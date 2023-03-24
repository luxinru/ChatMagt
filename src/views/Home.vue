
<template>
  <div class="page_root">
    <div class="header">
      <span class="left"> Android 设备管理平台 </span>

      <div class="info">
        <el-badge :value="12" class="item">
          <el-icon color="#21aa93" size="24px" @click="onOpenMsg"
            ><ChatLineSquare
          /></el-icon>
        </el-badge>

        <el-popover placement="bottom" :width="100" trigger="click">
          <template #reference>
            <span>admin</span>
          </template>

          <div class="exit" @click="onExit">退出登陆</div>
        </el-popover>
      </div>
    </div>

    <div class="container">
      <div class="chats">
        <div class="chat_header">
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
          <div class="btn" @click="isShowDialogForm = true">新建短信</div>
        </div>
        <el-input
          v-model="input"
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
            :class="{ active: currentContract[0]?.address === item[0].address }"
            @click="onContractClick(item)"
          >
            <el-avatar class="avatar" :size="50" :src="img" />
            <div class="info">
              <span> {{ item[0].address }}（{{ item.length }}） </span>
              <span>{{ item[0].body }}</span>
              <span>
                {{ moment(Number(item[0].date)).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="content_container">
          <template v-if="currentContract.length">
            <div class="content_header">
              <el-avatar class="avatar" :size="40" :src="img" />
              <span class="name"> {{ currentContract[0].address }} </span>
            </div>

            <div class="content_chat">
              <div
                class="item"
                v-for="(item, index) in currentContract"
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
                      <span @click="onTranslate(item)">翻译</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="content_footer">
          <el-input v-model="input" placeholder="请输入内容" size="large" />
          <el-button class="btn" type="primary" size="large">发送</el-button>
        </div>
      </div>
    </div>

    <el-drawer v-model="isShowDrawer" :with-header="false" class="drawer">
      <div class="drawer_container">
        <div class="item" v-for="index in 20" :key="index">
          <div class="item_header">
            <span>+15083260553</span>
            <span>2023-03-23 09:14:59</span>
          </div>
          <div class="item_content">
            【服务器w2】I think u have the wrong number【服务器w2】I think u
            have the wrong number【服务器w2】I think u have the wrong number
          </div>
        </div>
      </div>

      <div class="drawer_footer">
        <el-button class="btn" type="primary" size="large" style="width: 100%"
          >清空</el-button
        >
      </div>
    </el-drawer>

    <el-dialog v-model="isShowDialogForm" title="发送短信" style="width: 600px">
      <el-form :model="form">
        <el-form-item label="安卓设备">
          <el-select
            v-model="form.device"
            clearable
            placeholder="请选择安卓设备"
            style="width: 100%"
          >
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="对方号码">
          <el-input
            v-model="form.phone"
            clearable
            autocomplete="off"
            placeholder="请输入对方号码"
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowDialogForm = false">取消</el-button>
          <el-button type="primary" @click="isShowDialogForm = false">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
</script>

<script>
import { getDeviceList, tanslate } from '@/api'
import { groupBy } from 'lodash'
import moment from 'moment'
import cryptoJs from 'crypto-js'

export default {
  name: 'Home',

  data () {
    return {
      form: {
        device: '',
        phone: '',
        content: ''
      },
      isShowDialogForm: false,
      isShowDrawer: false,
      input: '',
      value: '',
      options: [],
      socket: null,
      list: [],
      currentContract: [],
      img: require('@/assets/3ea6beec64369c2642b92c6726f1epng.png')
    }
  },

  computed: {
    formatList () {
      return groupBy(
        this.list
          .filter((item) => item.address.indexOf(this.input) > -1)
          .filter((item) => item.device_id.indexOf(this.value) > -1),
        'address'
      )
    }
  },

  created () {
    this.socket = new WebSocket(
      'ws://47.243.207.73:3001/socket.io/?EIO=4&transport=websocket'
    )
  },

  mounted () {
    this.init()
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
      let str = event.data
      str = str.substr(0, 3)
      if (str.indexOf('0{"') > -1) {
        this.socket.send('40')
      } else if (str === '40{') {
        this.socket.send(
          '42["web->android",{"type":"recent-sms","timestamp":"1679588742","device":"web"},null]'
        )
      } else if (str === '2') {
        this.socket.send('3')
      } else if (str.indexOf('42[') > -1) {
      } else {
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
      const salt = this.generateSalt(10)
      const appid = '20230323001611962'
      const q = data.body
      const secret = 'iSL8VF5avKRQe4vou_Nv'
      const options = {
        from: 'auto',
        to: 'zh',
        appid,
        q,
        salt,
        sign: cryptoJs.MD5(appid + q + salt + secret)
      }

      const response = await tanslate(options)
      console.log('response :>> ', response)
    },

    onRefres () {
      ElMessage({
        message: '刷新成功',
        type: 'success'
      })
    },

    onContractClick (contract) {
      this.currentContract = contract
    },

    formatData (obj) {
      const dataList = obj.data.map((item) => {
        return {
          ...item,
          device_id: obj.device_id
        }
      })
      this.list = this.list.concat(dataList)
    },
    async init () {
      const res = await getDeviceList()
      this.options = []
      if (res.status) {
        this.options = res.data.map((item) => {
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
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .drawer_container {
      width: 100%;
      flex: 1 0;
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
    }

    .drawer_footer {
      position: sticky;
      bottom: 0;
      width: 100%;
      padding: 1rem 0 0;
    }
  }
}
</style>
