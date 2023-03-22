
<template>
  <div class="page_root">
    <div class="header">
      <span class="left"> Android 设备管理平台 </span>

      <div class="info">
        <el-badge :value="12" class="item">
          <el-icon color="#21aa93" size="24px"><ChatLineSquare /></el-icon>
        </el-badge>

        <el-popover placement="bottom" :width="100" trigger="click">
          <template #reference>
            <span>admin</span>
          </template>

          <div class="exit">退出登陆</div>
        </el-popover>
      </div>
    </div>

    <div class="container">
      <div class="chats">
        <div class="chat_header">
          <el-select v-model="value" class="elselect" placeholder="Select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="btn">新建短信</div>
        </div>
        <el-input
          v-model="input"
          class="elinput"
          placeholder="请输入关键字"
          :prefix-icon="Search"
        />

        <div class="tip">
          <span>最近联系人</span>
          <el-icon><Refresh /></el-icon>
        </div>

        <div class="chat_container">
          <div class="item" v-for="index in 20" :key="index">
            <el-avatar class="avatar" :size="50" src="" />
            <div class="info">
              <span> +12242895750（1） </span>
              <span>It is a long established fact that a reader w...</span>
              <span> 2023-03-22 10:28:56 </span>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="content_header">
          <el-avatar class="avatar" :size="40" src="" />
          <span class="name"> Jason Porter </span>
        </div>

        <div class="content_chat">
          <div
            class="item"
            v-for="index in 20"
            :key="index"
            :class="{ fanzhuan: index % 2 }"
          >
            <el-avatar v-if="!(index % 2)" class="avatar" :size="26" src="" />
            <div class="info">
              <span class="name">
                Jason Porter,2023-03-22 10:28:56
                <img src="" alt="" />
              </span>

              <div class="info_chat">
                Hope to have a chance to have lunch together next time ☺
              </div>
            </div>
          </div>
        </div>

        <div class="content_footer">
          <el-input v-model="input" placeholder="请输入内容" size="large" />
          <el-button class="btn" type="primary" size="large">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
</script>

<script>
export default {
  name: 'Home',

  data () {
    return {
      input: '',
      value: 'Option1',
      options: [
        {
          value: 'Option1',
          label: '所有设备'
        },
        {
          value: 'Option2',
          label: 'Option2'
        },
        {
          value: 'Option3',
          label: 'Option3'
        },
        {
          value: 'Option4',
          label: 'Option4'
        },
        {
          value: 'Option5',
          label: 'Option5'
        }
      ]
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

        &::-webkit-scrollbar {
          display: none;
        }

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
      }
    }

    .content {
      flex: 1 0;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;

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
              border-radius: 15px 0 15px 15px;
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
}
</style>
