<template>
  <div class="cad-tools-container">
    <div class="page-header">
      <h2>CAD工具</h2>
      <p>计算机辅助设计工具</p>
    </div>

    <div class="content-section">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-card title="设计工具" class="cad-card">
            <a-space direction="vertical" style="width: 100%">
              <a-form layout="vertical">
                <a-form-item label="设计类型">
                  <a-select v-model="designType" placeholder="选择设计类型">
                    <a-select-option value="schematic">原理图设计</a-select-option>
                    <a-select-option value="pcb">PCB设计</a-select-option>
                    <a-select-option value="3d">3D模型设计</a-select-option>
                    <a-select-option value="simulation">电路仿真</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="设计工具">
                  <a-select v-model="cadTool" placeholder="选择CAD工具">
                    <a-select-option value="kicad">KiCad</a-select-option>
                    <a-select-option value="eagle">Eagle</a-select-option>
                    <a-select-option value="altium">Altium Designer</a-select-option>
                    <a-select-option value="proteus">Proteus</a-select-option>
                    <a-select-option value="multisim">Multisim</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="项目模板">
                  <a-select v-model="projectTemplate" placeholder="选择项目模板">
                    <a-select-option value="stm32_basic">STM32基础模板</a-select-option>
                    <a-select-option value="arduino_basic">Arduino基础模板</a-select-option>
                    <a-select-option value="esp32_basic">ESP32基础模板</a-select-option>
                    <a-select-option value="custom">自定义模板</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="设计选项">
                  <a-checkbox-group v-model="designOptions">
                    <a-checkbox value="auto_routing">自动布线</a-checkbox>
                    <a-checkbox value="drc_check">设计规则检查</a-checkbox>
                    <a-checkbox value="3d_preview">3D预览</a-checkbox>
                    <a-checkbox value="bom_generation">BOM生成</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </a-form>

              <a-button type="primary" block @click="createProject">创建项目</a-button>
              <a-button block @click="openProject">打开项目</a-button>
              <a-button block @click="exportProject">导出项目</a-button>
            </a-space>
          </a-card>

          <a-card title="最近项目" class="cad-card" style="margin-top: 16px;">
            <a-list
              :data-source="recentProjects"
              :pagination="false"
              size="small"
            >
              <template #renderItem="{ item }">
                <a-list-item @click="openRecentProject(item)">
                  <a-list-item-meta>
                    <template #title>
                      <span class="project-name">{{ item.name }}</span>
                    </template>
                    <template #description>
                      <span class="project-info">{{ item.tool }} - {{ item.lastModified }}</span>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>

        <a-col :span="16">
          <a-card title="设计工作区" class="cad-card">
            <a-tabs v-model="workspaceTab">
              <a-tab-pane key="schematic" tab="原理图">
                <div class="design-workspace">
                  <div class="toolbar">
                    <a-space>
                      <a-button size="small">选择</a-button>
                      <a-button size="small">连线</a-button>
                      <a-button size="small">元件</a-button>
                      <a-button size="small">文本</a-button>
                      <a-button size="small">标注</a-button>
                    </a-space>
                  </div>

                  <div class="canvas-area">
                    <div class="canvas-placeholder">
                      <icon-font type="icon-schematic" style="font-size: 48px; color: #d9d9d9;" />
                      <p>原理图设计区域</p>
                      <p>点击"创建项目"开始设计</p>
                    </div>
                  </div>

                  <div class="component-panel">
                    <a-collapse v-model="activeComponents">
                      <a-collapse-panel key="mcu" header="微控制器">
                        <a-list size="small">
                          <a-list-item>STM32F103C8T6</a-list-item>
                          <a-list-item>STM32F407VGT6</a-list-item>
                          <a-list-item>ESP32-WROOM-32</a-list-item>
                        </a-list>
                      </a-collapse-panel>
                      <a-collapse-panel key="passive" header="被动元件">
                        <a-list size="small">
                          <a-list-item>电阻</a-list-item>
                          <a-list-item>电容</a-list-item>
                          <a-list-item>电感</a-list-item>
                        </a-list>
                      </a-collapse-panel>
                      <a-collapse-panel key="active" header="主动元件">
                        <a-list size="small">
                          <a-list-item>晶体管</a-list-item>
                          <a-list-item>运放</a-list-item>
                          <a-list-item>稳压器</a-list-item>
                        </a-list>
                      </a-collapse-panel>
                    </a-collapse>
                  </div>
                </div>
              </a-tab-pane>

              <a-tab-pane key="pcb" tab="PCB">
                <div class="design-workspace">
                  <div class="toolbar">
                    <a-space>
                      <a-button size="small">选择</a-button>
                      <a-button size="small">布线</a-button>
                      <a-button size="small">过孔</a-button>
                      <a-button size="small">铺铜</a-button>
                      <a-button size="small">标注</a-button>
                    </a-space>
                  </div>

                  <div class="canvas-area">
                    <div class="canvas-placeholder">
                      <icon-font type="icon-pcb" style="font-size: 48px; color: #d9d9d9;" />
                      <p>PCB设计区域</p>
                      <p>从原理图生成PCB布局</p>
                    </div>
                  </div>

                  <div class="layer-panel">
                    <a-collapse v-model="activeLayers">
                      <a-collapse-panel key="top" header="顶层">
                        <a-checkbox v-model="layerVisibility.top">显示</a-checkbox>
                      </a-collapse-panel>
                      <a-collapse-panel key="bottom" header="底层">
                        <a-checkbox v-model="layerVisibility.bottom">显示</a-checkbox>
                      </a-collapse-panel>
                      <a-collapse-panel key="silkscreen" header="丝印层">
                        <a-checkbox v-model="layerVisibility.silkscreen">显示</a-checkbox>
                      </a-collapse-panel>
                      <a-collapse-panel key="drill" header="钻孔层">
                        <a-checkbox v-model="layerVisibility.drill">显示</a-checkbox>
                      </a-collapse-panel>
                    </a-collapse>
                  </div>
                </div>
              </a-tab-pane>

              <a-tab-pane key="3d" tab="3D视图">
                <div class="design-workspace">
                  <div class="toolbar">
                    <a-space>
                      <a-button size="small">旋转</a-button>
                      <a-button size="small">缩放</a-button>
                      <a-button size="small">平移</a-button>
                      <a-button size="small">重置视图</a-button>
                    </a-space>
                  </div>

                  <div class="canvas-area">
                    <div class="canvas-placeholder">
                      <icon-font type="icon-3d" style="font-size: 48px; color: #d9d9d9;" />
                      <p>3D视图区域</p>
                      <p>查看PCB的3D模型</p>
                    </div>
                  </div>
                </div>
              </a-tab-pane>

              <a-tab-pane key="simulation" tab="仿真">
                <div class="design-workspace">
                  <div class="toolbar">
                    <a-space>
                      <a-button size="small">运行仿真</a-button>
                      <a-button size="small">停止仿真</a-button>
                      <a-button size="small">设置参数</a-button>
                      <a-button size="small">查看结果</a-button>
                    </a-space>
                  </div>

                  <div class="canvas-area">
                    <div class="canvas-placeholder">
                      <icon-font type="icon-simulation" style="font-size: 48px; color: #d9d9d9;" />
                      <p>仿真区域</p>
                      <p>运行电路仿真分析</p>
                    </div>
                  </div>

                  <div class="simulation-panel">
                    <a-card title="仿真结果" size="small">
                      <a-empty description="暂无仿真数据" />
                    </a-card>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import globalComponents from '@/components/global';

const { iconFont: IconFont } = globalComponents;

const designType = ref('schematic');
const cadTool = ref('kicad');
const projectTemplate = ref('stm32_basic');
const designOptions = ref(['auto_routing', 'drc_check']);
const workspaceTab = ref('schematic');
const activeComponents = ref(['mcu']);
const activeLayers = ref(['top']);
const layerVisibility = ref({
  top: true,
  bottom: true,
  silkscreen: true,
  drill: true
});

const recentProjects = ref([
  {
    id: 1,
    name: 'STM32开发板',
    tool: 'KiCad',
    lastModified: '2024-01-28 14:30'
  },
  {
    id: 2,
    name: 'ESP32项目',
    tool: 'Eagle',
    lastModified: '2024-01-27 09:15'
  },
  {
    id: 3,
    name: 'Arduino扩展板',
    tool: 'KiCad',
    lastModified: '2024-01-26 16:45'
  }
]);

function createProject() {
  console.log('创建项目');
}

function openProject() {
  console.log('打开项目');
}

function exportProject() {
  console.log('导出项目');
}

function openRecentProject(project) {
  console.log('打开最近项目:', project);
}
</script>

<style lang="less" scoped>
.cad-tools-container {
  padding: 24px;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

.page-header {
  margin-bottom: 24px;

  h2 {
    margin: 0 0 8px 0;
    color: #1890ff;
  }

  p {
    margin: 0;
    color: #666;
  }
}

.content-section {
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.cad-card {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.project-name {
  font-weight: 500;
  color: #1890ff;
}

.project-info {
  color: #666;
  font-size: 12px;
}

.design-workspace {
  display: flex;
  height: 500px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;

  .toolbar {
    padding: 12px;
    border-bottom: 1px solid #e8e8e8;
    background: #fafafa;
    width: 100%;
  }

  .canvas-area {
    flex: 1;
    position: relative;

    .canvas-placeholder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #999;

      p {
        margin: 8px 0 0 0;
        font-size: 14px;
      }
    }
  }

  .component-panel,
  .layer-panel {
    width: 200px;
    border-left: 1px solid #e8e8e8;
    background: #fafafa;
    overflow-y: auto;
  }
}

// 滚动条样式
.content-section::-webkit-scrollbar {
  width: 6px;
}

.content-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.content-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.content-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
