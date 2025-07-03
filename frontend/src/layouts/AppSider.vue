<template>
  <a-layout id="app-layout-sider">
    <!-- 左侧单片机信息面板 -->
    <a-layout-sider
      :width="leftPanelWidth"
      class="left-panel-sider"
      :trigger="null"
      collapsible
      :collapsed="siderCollapsed"
      @update:collapsed="siderCollapsed = $event"
    >
      <!-- 单片机信息头部 -->
      <div class="mcu-header">
        <div class="mcu-model">
          <span v-if="selectedMcu">{{ selectedMcu.name }}</span>
          <span v-else class="no-mcu">未选择型号</span>
        </div>
        <a-button
          type="text"
          size="small"
          @click="goToSelectPage"
          class="change-mcu-btn"
        >
          重新选择
        </a-button>
      </div>

      <!-- 单片机配置内容 -->
      <div class="mcu-content">
        <McuConfigPanel />
      </div>

      <!-- 拖拽调整宽度的手柄 -->
      <div
        v-if="!siderCollapsed"
        class="resize-handle"
        @mousedown="startResize"
      ></div>

      <!-- 折叠/展开触发器 -->
      <div
        class="collapse-trigger"
        :class="{ 'collapsed': siderCollapsed }"
        @click="toggleSider"
      >
        <span class="trigger-icon">
          {{ siderCollapsed ? '>' : '<' }}
        </span>
      </div>
    </a-layout-sider>

    <!-- 右侧内容区域 -->
    <a-layout class="right-content">
      <!-- 顶部主导航 -->
      <a-layout-header class="layout-header">
        <a-menu
          class="menu-item"
          theme="light"
          mode="horizontal"
          :selectedKeys="[current]"
          @click="menuHandle"
        >
          <a-menu-item v-for="(menuInfo, index) in menu" :key="index">
            {{ menuInfo.title }}
          </a-menu-item>
        </a-menu>
        <div class="header-right">
          <a-button
            type="text"
            size="small"
            :class="{ 'always-on-top': isAlwaysOnTop }"
            @click="toggleAlwaysOnTop"
            title="置顶窗口"
          >
            <template #icon>
              <icon-font type="icon-pushpin" />
            </template>
          </a-button>
          <a-button
            type="primary"
            class="codegen-btn"
            @click="handleCodeGen"
          >
            CodeGen
          </a-button>
        </div>
      </a-layout-header>

      <!-- 内容区域 - 互斥显示三种状态 -->
      <a-layout-content class="layout-content">
        <!-- 状态1：欢迎界面 -->
        <div class="content-welcome" v-if="welcomeModalVisible">
          <a-modal v-model="welcomeModalVisible" title="欢迎" @cancel="closeWelcomeModal" :footer="null">
            <div style="text-align:center;font-size:18px;">欢迎使用本软件！</div>
          </a-modal>
        </div>
        <!-- 状态2：导航页面 -->
        <div class="content-nav-page" v-else>
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import globalComponents from '@/components/global';
import McuConfigPanel from '@/views/mcuConfig/index.vue';
import CoderContent from '@/views/mcuConfig/Editor/coderContent.vue';
import { ipcApiRoute } from '@/api';
import { Modal } from 'ant-design-vue';

const { iconFont: IconFont } = globalComponents;

const router = useRouter();

const current = ref('menu_1');
const leftPanelWidth = ref(350);
const siderCollapsed = ref(false);
const isAlwaysOnTop = ref(false);
const welcomeModalVisible = ref(false);

// 选中的单片机信息
const selectedMcu = ref({
  name: 'STM32F103C8T6',
  image: '/images/mcu/stm32f103c8t6.png',
  description: '基于ARM Cortex-M3内核的32位微控制器，具有丰富的外设接口和强大的处理能力。',
  architecture: 'ARM Cortex-M3',
  frequency: '72MHz',
  flash: '64KB'
});

const menu = ref({
  'menu_1': {
    icon: 'icon-setting',
    title: '引脚配置',
    pageName: 'PinoutConfig',
    params: {}
  },
  'menu_2': {
    icon: 'icon-clock-circle',
    title: '时钟配置',
    pageName: 'ClockConfig',
    params: {}
  },
  'menu_3': {
    icon: 'icon-project',
    title: '项目管理',
    pageName: 'ProjectManager',
    params: {}
  },
  'menu_4': {
    icon: 'icon-tool',
    title: '工具',
    pageName: 'Tools',
    params: {}
  },
  'menu_5': {
    icon: 'icon-fengche',
    title: '框架',
    pageName: 'Framework',
    params: {}
  },
  'menu_6': {
    icon: 'icon-niudan',
    title: '系统',
    pageName: 'Os',
    params: {}
  },
  'menu_7': {
    icon: 'icon-liuxing',
    title: '特效',
    pageName: 'Effect',
    params: {}
  },
  'menu_8': {
    icon: 'icon-gouwu',
    title: 'cross',
    pageName: 'Cross',
    params: {}
  }
});

onMounted(() => {
  // 默认跳转到主页面
  router.push('/');
  loadSelectedMcu();
  loadAlwaysOnTopStatus();

  // 监听主进程菜单切换欢迎页事件
  if (window.require) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.on('toggle-welcome-page', (event, status) => {
      welcomeModalVisible.value = !!status;
    });
    // 获取初始欢迎页状态
    ipcRenderer.invoke('get-welcome-page-status').then(res => {
      if (typeof res.showWelcomePage === 'boolean') {
        welcomeModalVisible.value = !!res.showWelcomePage;
      }
    });
  }
});

function loadSelectedMcu() {
  const mcuData = localStorage.getItem('selectedMicrocontroller');
  if (mcuData) {
    try {
      selectedMcu.value = JSON.parse(mcuData);
    } catch (error) {
      console.error('解析单片机数据失败:', error);
    }
  }
}

function menuHandle(e) {
  console.log('sider menu e:', e);
  if (e) {
    current.value = e.key;
  }
  console.log('sider menu current:', current.value);

  // 关闭欢迎界面和编辑器
  welcomeModalVisible.value = false;

  const linkInfo = menu.value[current.value];
  console.log('[home] load linkInfo:', linkInfo);
  router.push({ name: linkInfo.pageName, params: linkInfo.params });
}

function handleCodeGen() {
  console.log('CodeGen button clicked');
  // 关闭欢迎界面和编辑器
  welcomeModalVisible.value = false;
  // 跳转到单片机选择页面
  router.push('/microcontroller/choose');
}

function goToSelectPage() {
  // 关闭欢迎界面和编辑器
  welcomeModalVisible.value = false;
  router.push('/microcontroller/choose');
}

// 拖拽调整宽度
function startResize(e) {
  e.preventDefault();

  // 如果侧边栏已折叠，不允许拖拽
  if (siderCollapsed.value) {
    return;
  }

  const startX = e.clientX;
  const startWidth = leftPanelWidth.value;

  function onMouseMove(e) {
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(250, Math.min(600, startWidth + deltaX));
    leftPanelWidth.value = newWidth;
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function toggleSider() {
  siderCollapsed.value = !siderCollapsed.value;
}

// 加载置顶状态
async function loadAlwaysOnTopStatus() {
  if (window.require) {
    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke(ipcApiRoute.os.getAlwaysOnTopStatus);
      isAlwaysOnTop.value = result.isAlwaysOnTop;
    } catch (error) {
      console.error('获取置顶状态失败:', error);
    }
  }
}

// 切换置顶状态
async function toggleAlwaysOnTop() {
  if (window.require) {
    try {
      const { ipcRenderer } = window.require('electron');
      const result = await ipcRenderer.invoke(ipcApiRoute.os.toggleAlwaysOnTop);
      isAlwaysOnTop.value = result.isAlwaysOnTop;
    } catch (error) {
      console.error('切换置顶状态失败:', error);
    }
  }
}

// 关闭欢迎界面
function closeWelcomeModal() {
  welcomeModalVisible.value = false;
  if (window.require) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.invoke('set-welcome-page-status', false);
  }
}
</script>

<style lang="less" scoped>
#app-layout-sider {
  height: 100vh;
}

.left-panel-sider {
  background: white;
  border-right: 1px solid #e8e8e8;
  position: relative;

  :deep(.ant-layout-sider-children) {
    display: flex;
    flex-direction: column;
  }
}

.mcu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  height: 64px;

  .mcu-model {
    font-weight: 500;
    color: #1890ff;
    font-size: 14px;

    .no-mcu {
      color: #999;
    }
  }

  .change-mcu-btn {
    color: #666;

    &:hover {
      color: #1890ff;
    }
  }
}

.mcu-content {
  flex: 1;
  overflow: hidden;
}

.resize-handle {
  position: absolute;
  right: -3px;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: col-resize;
  background: transparent;
  z-index: 5;

  &:hover {
    background: rgba(24, 144, 255, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 20px;
    background: #d9d9d9;
    border-radius: 1px;
  }
}

.right-content {
  display: flex;
  flex-direction: column;
}

.layout-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0;
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .menu-item {
    flex: 1;
    border: none;
    background: transparent;

    :deep(.ant-menu-item) {
      height: 48px;
      line-height: 48px;
      margin: 0;
      padding: 0 20px !important;
      font-size: 14px;
      font-weight: 500;
      color: #333;
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
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 16px;

    .codegen-btn {
      font-weight: 500;
    }
  }
}

.codegen-btn {
  height: 32px;
  padding: 0 16px;
  font-weight: 500;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  overflow: hidden;
}

.content-welcome {
  flex: 1;
  background: transparent;
  overflow: hidden;
}

.content-nav-page {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.collapse-trigger {
  position: absolute;
  right: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: white;
  border: 1px solid #e8e8e8;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #d9d9d9;
  }

  &.collapsed {
    right: -24px;
  }

  .trigger-icon {
    font-size: 14px;
    color: #666;
    transition: all 0.3s ease;
  }

  &:hover .trigger-icon {
    color: #1890ff;
  }
}
</style>
