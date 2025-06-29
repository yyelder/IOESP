<template>
  <div class="config-container">
    <a-collapse v-model:activeKey="activeCollapseKeys" accordion>
      <!-- 基础配置 -->
      <a-collapse-panel key="basic" header="基础配置">
        <div class="config-section">
          <a-form :model="basicConfig" layout="vertical">
            <a-form-item label="项目名称">
              <a-input v-model:value="basicConfig.projectName" placeholder="请输入项目名称" />
            </a-form-item>
            <a-form-item label="时钟配置">
              <a-select v-model:value="basicConfig.clockConfig" placeholder="选择时钟配置">
                <a-select-option value="internal">内部时钟</a-select-option>
                <a-select-option value="external">外部时钟</a-select-option>
                <a-select-option value="crystal">晶振时钟</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="调试接口">
              <a-checkbox-group v-model:value="basicConfig.debugInterfaces">
                <a-checkbox value="swd">SWD</a-checkbox>
                <a-checkbox value="jtag">JTAG</a-checkbox>
                <a-checkbox value="uart">UART</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-form>
        </div>
      </a-collapse-panel>

      <!-- 外设配置 -->
      <a-collapse-panel key="peripherals" header="外设配置">
        <div class="config-section">
          <a-form :model="peripheralConfig" layout="vertical">
            <a-form-item label="GPIO配置">
              <a-checkbox-group v-model:value="peripheralConfig.gpioConfig">
                <a-checkbox value="led">LED指示灯</a-checkbox>
                <a-checkbox value="button">按键输入</a-checkbox>
                <a-checkbox value="relay">继电器控制</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item label="通信接口">
              <a-checkbox-group v-model:value="peripheralConfig.communication">
                <a-checkbox value="uart">UART</a-checkbox>
                <a-checkbox value="i2c">I2C</a-checkbox>
                <a-checkbox value="spi">SPI</a-checkbox>
                <a-checkbox value="can">CAN</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item label="定时器">
              <a-checkbox-group v-model:value="peripheralConfig.timers">
                <a-checkbox value="timer1">定时器1</a-checkbox>
                <a-checkbox value="timer2">定时器2</a-checkbox>
                <a-checkbox value="timer3">定时器3</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-form>
        </div>
      </a-collapse-panel>

      <!-- 高级配置 -->
      <a-collapse-panel key="advanced" header="高级配置">
        <div class="config-section">
          <a-form :model="advancedConfig" layout="vertical">
            <a-form-item label="中断优先级">
              <a-select v-model:value="advancedConfig.interruptPriority" placeholder="选择中断优先级">
                <a-select-option value="low">低优先级</a-select-option>
                <a-select-option value="medium">中优先级</a-select-option>
                <a-select-option value="high">高优先级</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="电源管理">
              <a-checkbox-group v-model:value="advancedConfig.powerManagement">
                <a-checkbox value="sleep">睡眠模式</a-checkbox>
                <a-checkbox value="stop">停止模式</a-checkbox>
                <a-checkbox value="standby">待机模式</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item label="看门狗">
              <a-checkbox v-model:checked="advancedConfig.watchdog">启用独立看门狗</a-checkbox>
            </a-form-item>
          </a-form>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 折叠面板激活的键
const activeCollapseKeys = ref(['basic']);

// 基础配置
const basicConfig = reactive({
  projectName: 'STM32_Project',
  clockConfig: 'internal',
  debugInterfaces: ['swd']
});

// 外设配置
const peripheralConfig = reactive({
  gpioConfig: ['led'],
  communication: ['uart'],
  timers: ['timer1']
});

// 高级配置
const advancedConfig = reactive({
  interruptPriority: 'medium',
  powerManagement: ['sleep'],
  watchdog: false
});

// 暴露配置数据给父组件
defineExpose({
  basicConfig,
  peripheralConfig,
  advancedConfig
});
</script>

<style lang="less" scoped>
.config-container {
  padding: 16px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.config-section {
  padding: 8px 0;
}

:deep(.ant-collapse-header) {
  font-weight: 500;
  color: #1890ff;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #333;
}

:deep(.ant-collapse-content-box) {
  padding: 16px;
}
</style>
