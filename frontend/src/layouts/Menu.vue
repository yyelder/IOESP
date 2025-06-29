<template>
  <a-layout id="app-menu">
    <!-- ProjectManager和Tools特殊布局 -->
    <template v-if="props.id === 'projectManager' || props.id === 'tools'">
      <a-layout style="height: 100%;">
        <!-- 左侧导航栏 -->
        <a-layout-sider
          width="200"
          :class="`${props.id}-sider`"
          :style="{ background: '#fafafa', borderRight: '1px solid #e8e8e8' }"
        >
          <div class="sider-header">
            <h3>{{ getSiderTitle() }}</h3>
          </div>
          <a-menu
            theme="light"
            mode="inline"
            :selectedKeys="[current]"
            @click="changeMenu"
            :class="`${props.id}-menu`"
          >
            <a-menu-item v-for="(menuInfo, subIndex) in menu" :key="subIndex">
              <router-link :to="{ name: menuInfo.pageName, params: menuInfo.params}">
                <icon-font :type="menuInfo.icon" />
                <span>{{ menuInfo.title }}</span>
              </router-link>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>

        <!-- 右侧内容区域 -->
        <a-layout>
          <a-layout-content :class="`${props.id}-content`">
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </template>

    <!-- 其他模块的原有布局 -->
    <template v-else>
      <a-layout-header class="sub-header">
        <a-menu
          theme="light"
          mode="horizontal"
          :selectedKeys="[current]"
          @click="changeMenu">
          <a-menu-item v-for="(menuInfo, subIndex) in menu" :key="subIndex">
            <router-link :to="{ name: menuInfo.pageName, params: menuInfo.params}">
              <span>{{ menuInfo.title }}</span>
            </router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout>
        <a-layout-content class="sub-content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </template>
  </a-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import subMenu from '@/router/subMenu';
import globalComponents from '@/components/global';

const { iconFont: IconFont } = globalComponents;

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

const router = useRouter();
const current = ref('menu_100');
const menu = ref({});

watch(() => props.id, (newValue) => {
  console.log('watch menu id ', newValue);
  // 切换 appSider 时，重置 current
  current.value = "menu_100"
  menuHandle();
});

onMounted(() => {
  menuHandle();
});

function menuHandle() {
  console.log('handle menu id:', props.id);
  menu.value = subMenu[props.id];
  const linkInfo = menu.value[current.value];
  router.push({ name: linkInfo.pageName, params: linkInfo.params });
}

function changeMenu(e) {
  current.value = e.key;
}

function getSiderTitle() {
  const titleMap = {
    'projectManager': '项目管理',
    'tools': '工具集'
  };
  return titleMap[props.id] || '导航';
}
</script>

<style lang="less" scoped>
#app-menu {
  height: 100%;

  // ProjectManager和Tools特殊样式
  .project-manager-sider,
  .tools-sider {
    .sider-header {
      padding: 16px;
      border-bottom: 1px solid #e8e8e8;

      h3 {
        margin: 0;
        color: #1890ff;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .project-manager-menu,
    .tools-menu {
      border: none;
      background: transparent;

      .ant-menu-item {
        height: 48px;
        line-height: 48px;
        margin: 0;
        padding: 0 16px !important;
        font-size: 14px;
        font-weight: 500;
        color: #555;
        transition: all 0.3s ease;
        border-radius: 0;

        &:hover {
          color: #1890ff;
          background-color: #f0f8ff;
        }

        &.ant-menu-item-selected {
          color: #1890ff;
          background-color: #e6f7ff;
          border-right: 3px solid #1890ff;
        }

        a {
          color: inherit;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;

          &:hover {
            color: inherit;
          }
        }
      }
    }
  }

  .project-manager-content,
  .tools-content {
    padding: 0;
    background: #fff;
  }

  // 原有样式
  .sub-header {
    background: #FAFAFA;
    border-bottom: 1px solid #e8e8e8;
    padding: 0;
    height: 48px;
    line-height: 48px;
    .ant-menu {
      border: none;
      background: transparent;
      .ant-menu-item {
        height: 48px;
        line-height: 48px;
        margin: 0;
        padding: 0 20px !important;
        font-size: 13px;
        font-weight: 500;
        color: #555;
        transition: all 0.3s ease;

        &:hover {
          color: #1890ff;
          background-color: #f0f8ff;
        }

        &.ant-menu-item-selected {
          color: #1890ff;
          background-color: #e6f7ff;
          border-bottom: 2px solid #1890ff;
        }

        a {
          color: inherit;
          text-decoration: none;

          &:hover {
            color: inherit;
          }
        }
      }
    }
  }
  .sub-content {
    padding: 16px;
  }
}
</style>
