<template>
  <div class="advanced-settings-container">
    <div class="page-header">
      <h2>高级设置</h2>
      <p>项目的高级配置和优化选项</p>
    </div>

    <div class="content-section">
      <a-tabs v-model="activeTab">
        <a-tab-pane key="compiler" tab="编译器设置">
          <a-card title="编译器配置" class="settings-card">
            <a-form layout="vertical">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="编译器路径">
                    <a-input v-model="compilerPath" placeholder="编译器可执行文件路径" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="工具链版本">
                    <a-select v-model="toolchainVersion" placeholder="选择工具链版本">
                      <a-select-option value="gcc-arm-none-eabi-9">GCC ARM 9.3</a-select-option>
                      <a-select-option value="gcc-arm-none-eabi-10">GCC ARM 10.3</a-select-option>
                      <a-select-option value="gcc-arm-none-eabi-11">GCC ARM 11.2</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item label="编译标志">
                <a-textarea v-model="compilerFlags" :rows="3" placeholder="额外的编译标志" />
              </a-form-item>

              <a-form-item label="链接标志">
                <a-textarea v-model="linkerFlags" :rows="3" placeholder="额外的链接标志" />
              </a-form-item>
            </a-form>
          </a-card>
        </a-tab-pane>

        <a-tab-pane key="debug" tab="调试设置">
          <a-card title="调试器配置" class="settings-card">
            <a-form layout="vertical">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="调试器类型">
                    <a-select v-model="debuggerType" placeholder="选择调试器">
                      <a-select-option value="stlink">ST-Link</a-select-option>
                      <a-select-option value="jlink">J-Link</a-select-option>
                      <a-select-option value="openocd">OpenOCD</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="调试端口">
                    <a-input v-model="debugPort" placeholder="调试端口" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item label="调试脚本">
                <a-textarea v-model="debugScript" :rows="4" placeholder="调试脚本内容" />
              </a-form-item>

              <a-form-item label="调试选项">
                <a-checkbox-group v-model="debugOptions">
                  <a-checkbox value="semihosting">半主机模式</a-checkbox>
                  <a-checkbox value="swd">SWD接口</a-checkbox>
                  <a-checkbox value="jtag">JTAG接口</a-checkbox>
                  <a-checkbox value="reset">自动复位</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-form>
          </a-card>
        </a-tab-pane>

        <a-tab-pane key="optimization" tab="优化设置">
          <a-card title="代码优化" class="settings-card">
            <a-form layout="vertical">
              <a-form-item label="优化级别">
                <a-radio-group v-model="optimizationLevel">
                  <a-radio value="O0">O0 - 无优化</a-radio>
                  <a-radio value="O1">O1 - 基本优化</a-radio>
                  <a-radio value="O2">O2 - 标准优化</a-radio>
                  <a-radio value="O3">O3 - 高级优化</a-radio>
                  <a-radio value="Os">Os - 大小优化</a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item label="优化选项">
                <a-checkbox-group v-model="optimizationOptions">
                  <a-checkbox value="inline">内联函数</a-checkbox>
                  <a-checkbox value="loop">循环优化</a-checkbox>
                  <a-checkbox value="branch">分支预测</a-checkbox>
                  <a-checkbox value="vector">向量化</a-checkbox>
                </a-checkbox-group>
              </a-form-item>

              <a-form-item label="链接时优化">
                <a-switch v-model="ltoEnabled" />
                <span class="switch-label">启用链接时优化(LTO)</span>
              </a-form-item>
            </a-form>
          </a-card>
        </a-tab-pane>

        <a-tab-pane key="build" tab="构建设置">
          <a-card title="构建配置" class="settings-card">
            <a-form layout="vertical">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="构建类型">
                    <a-select v-model="buildType" placeholder="选择构建类型">
                      <a-select-option value="debug">Debug</a-select-option>
                      <a-select-option value="release">Release</a-select-option>
                      <a-select-option value="profile">Profile</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="并行构建">
                    <a-input-number v-model="parallelJobs" :min="1" :max="16" style="width: 100%" />
                    <span class="unit-text">个任务</span>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item label="构建目录">
                <a-input v-model="buildDir" placeholder="构建输出目录" />
              </a-form-item>

              <a-form-item label="构建选项">
                <a-checkbox-group v-model="buildOptions">
                  <a-checkbox value="clean">清理构建</a-checkbox>
                  <a-checkbox value="verbose">详细输出</a-checkbox>
                  <a-checkbox value="keep">保留中间文件</a-checkbox>
                  <a-checkbox value="analyze">代码分析</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-form>
          </a-card>
        </a-tab-pane>
      </a-tabs>

      <a-card title="操作" class="settings-card">
        <a-space>
          <a-button type="primary" @click="saveSettings">保存设置</a-button>
          <a-button @click="loadSettings">加载设置</a-button>
          <a-button @click="resetSettings">重置设置</a-button>
          <a-button @click="exportSettings">导出设置</a-button>
          <a-button @click="importSettings">导入设置</a-button>
        </a-space>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('compiler');

// 编译器设置
const compilerPath = ref('/usr/bin/arm-none-eabi-gcc');
const toolchainVersion = ref('gcc-arm-none-eabi-10');
const compilerFlags = ref('-Wall -Wextra -Werror');
const linkerFlags = ref('-Wl,--gc-sections');

// 调试设置
const debuggerType = ref('stlink');
const debugPort = ref('COM3');
const debugScript = ref('target remote localhost:3333\nmonitor reset halt\nload\nmonitor reset');
const debugOptions = ref(['swd', 'reset']);

// 优化设置
const optimizationLevel = ref('O2');
const optimizationOptions = ref(['inline', 'loop']);
const ltoEnabled = ref(false);

// 构建设置
const buildType = ref('debug');
const parallelJobs = ref(4);
const buildDir = ref('./build');
const buildOptions = ref(['clean', 'verbose']);

function saveSettings() {
  console.log('保存设置');
}

function loadSettings() {
  console.log('加载设置');
}

function resetSettings() {
  console.log('重置设置');
}

function exportSettings() {
  console.log('导出设置');
}

function importSettings() {
  console.log('导入设置');
}
</script>

<style lang="less" scoped>
.advanced-settings-container {
  padding: 24px;
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
  .settings-card {
    margin-bottom: 24px;
  }
}

.switch-label {
  margin-left: 8px;
  color: #333;
}

.unit-text {
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}
</style>
