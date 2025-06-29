<template>
  <div class="pinout-config-container">
    <div class="page-header">
      <h2>引脚配置信息</h2>
      <p>配置单片机的引脚参数和高级设置</p>
    </div>

    <div class="content-section">

      <a-card title="引脚状态监控" class="config-card">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic title="总引脚数" :value="totalPins" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="已配置" :value="configuredPins" />
          </a-col>
          <a-col :span="8">
            <a-statistic title="未配置" :value="unconfiguredPins" />
          </a-col>
        </a-row>

        <a-divider />

        <a-space>
          <a-button type="primary" @click="saveConfig">保存配置</a-button>
          <a-button @click="resetConfig">重置配置</a-button>
          <a-button @click="exportConfig">导出配置</a-button>
          <a-button @click="importConfig">导入配置</a-button>
        </a-space>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const pinNumber = ref(0);
const pinName = ref('');
const pinType = ref('digital');
const defaultState = ref('low');
const interruptModes = ref([]);
const filterTime = ref(10);
const debounceTime = ref(50);
const pwmFrequency = ref(1000);
const pwmDutyCycle = ref(50);
const uartBaudRate = ref('115200');

const totalPins = ref(64);
const configuredPins = ref(12);

const unconfiguredPins = computed(() => totalPins.value - configuredPins.value);

function saveConfig() {
  console.log('保存配置');
}

function resetConfig() {
  console.log('重置配置');
}

function exportConfig() {
  console.log('导出配置');
}

function importConfig() {
  console.log('导入配置');
}
</script>

<style lang="less" scoped>
.pinout-config-container {
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
  .config-card {
    margin-bottom: 24px;
  }
}

.unit-text {
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}
</style>
