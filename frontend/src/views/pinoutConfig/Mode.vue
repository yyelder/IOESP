<template>
  <div class="pinout-mode-container">
    <div class="page-header">
      <h2>引脚配置</h2>
      <p>配置单片机的引脚模式和功能</p>
    </div>

    <div class="content-section">
      <div class="main-layout">
        <!-- 左侧配置区域 -->
        <div class="config-panel">
          <a-card title="引脚配置" class="config-card">
            <!-- 引脚列表 -->
            <div class="pin-list-section">
              <h3>引脚列表</h3>

              <!-- 搜索框 -->
              <div class="search-section">
                <a-input-search
                  :value="searchKeyword"
                  placeholder="搜索引脚名称或功能"
                  size="small"
                  @search="handleSearch"
                  @change="handleSearchChange"
                  style="margin-bottom: 12px;"
                />
              </div>

              <a-table
                :columns="pinColumns"
                :data-source="filteredPins"
                :pagination="false"
                size="small"
                :scroll="{ y: 300 }"
                @row-click="selectPin"
                :row-class-name="getRowClassName"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'pinName'">
                    <span class="pin-name-cell">{{ record.name }}</span>
                  </template>
                  <template v-else-if="column.key === 'signalOnPin'">
                    <span>{{ record.function }}</span>
                  </template>
                  <template v-else-if="column.key === 'gpioOutputLevel'">
                    <a-tag :color="getOutputLevelColor(record)" size="small">
                      {{ getOutputLevelText(record) }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'gpioMode'">
                    <a-tag :color="getModeColor(record.mode)" size="small">
                      {{ getModeText(record.mode) }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'gpioPullUpDown'">
                    <span>{{ getPullUpDownText(record.pullMode) }}</span>
                  </template>
                  <template v-else-if="column.key === 'maxOutputSpeed'">
                    <span>{{ getSpeedText(record.speed) }}</span>
                  </template>
                  <template v-else-if="column.key === 'userLabel'">
                    <a-input
                      v-model="record.userLabel"
                      size="small"
                      placeholder="用户标签"
                      @click.stop
                    />
                  </template>
                  <template v-else-if="column.key === 'modified'">
                    <a-tag :color="record.configured ? 'green' : 'orange'" size="small">
                      {{ record.configured ? '已修改' : '未修改' }}
                    </a-tag>
                  </template>
                </template>
              </a-table>
            </div>

            <!-- 配置选项 -->
            <div v-if="selectedPin" class="config-options-section">
              <a-divider />
              <h3>{{ selectedPin.name }} 配置</h3>
              <a-form layout="vertical" size="small">
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="引脚模式">
                      <a-select v-model="selectedPin.mode" placeholder="选择引脚模式">
                        <a-select-option value="input">输入模式</a-select-option>
                        <a-select-option value="output">输出模式</a-select-option>
                        <a-select-option value="analog">模拟模式</a-select-option>
                        <a-select-option value="pwm">PWM模式</a-select-option>
                        <a-select-option value="uart">UART模式</a-select-option>
                        <a-select-option value="spi">SPI模式</a-select-option>
                        <a-select-option value="i2c">I2C模式</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="上拉/下拉">
                      <a-select v-model="selectedPin.pullMode" placeholder="选择上拉/下拉">
                        <a-select-option value="none">无</a-select-option>
                        <a-select-option value="pullup">上拉</a-select-option>
                        <a-select-option value="pulldown">下拉</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="驱动能力">
                      <a-select v-model="selectedPin.driveStrength" placeholder="选择驱动能力">
                        <a-select-option value="2ma">2mA</a-select-option>
                        <a-select-option value="4ma">4mA</a-select-option>
                        <a-select-option value="8ma">8mA</a-select-option>
                        <a-select-option value="12ma">12mA</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="速度等级">
                      <a-select v-model="selectedPin.speed" placeholder="选择速度等级">
                        <a-select-option value="low">低速</a-select-option>
                        <a-select-option value="medium">中速</a-select-option>
                        <a-select-option value="high">高速</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="默认状态">
                      <a-select v-model="selectedPin.defaultState" placeholder="选择默认状态">
                        <a-select-option value="high">高电平</a-select-option>
                        <a-select-option value="low">低电平</a-select-option>
                        <a-select-option value="floating">浮空</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="中断模式">
                      <a-select v-model="selectedPin.interruptMode" placeholder="选择中断模式" mode="multiple">
                        <a-select-option value="rising">上升沿</a-select-option>
                        <a-select-option value="falling">下降沿</a-select-option>
                        <a-select-option value="both">双边沿</a-select-option>
                        <a-select-option value="none">无中断</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="中断优先级">
                      <a-select v-model="selectedPin.interruptPriority" placeholder="选择中断优先级">
                        <a-select-option value="highest">最高</a-select-option>
                        <a-select-option value="high">高</a-select-option>
                        <a-select-option value="medium">中</a-select-option>
                        <a-select-option value="low">低</a-select-option>
                        <a-select-option value="lowest">最低</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="中断回调">
                      <a-input v-model="selectedPin.interruptCallback" placeholder="中断回调函数名" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16" v-if="selectedPin.mode === 'pwm'">
                  <a-col :span="12">
                    <a-form-item label="PWM频率">
                      <a-input-number v-model="selectedPin.pwmFrequency" :min="1" :max="100000" style="width: 100%" />
                      <span class="unit-text">Hz</span>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="PWM占空比">
                      <a-slider v-model="selectedPin.pwmDutyCycle" :min="0" :max="100" />
                      <span class="unit-text">{{ selectedPin.pwmDutyCycle }}%</span>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item>
                  <a-space>
                    <a-button type="primary" size="small" @click="savePinConfig">保存配置</a-button>
                    <a-button size="small" @click="resetPinConfig">重置配置</a-button>
                    <a-button size="small" @click="applyToAll">应用到所有</a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </div>

            <!-- 未选择引脚时的提示 -->
            <div v-else class="no-selection">
              <a-empty description="请选择一个引脚进行配置" />
            </div>
          </a-card>
        </div>

        <!-- 右侧芯片图区域 -->
        <div class="chip-panel">
          <a-card title="芯片引脚图" class="chip-card">
            <div class="chip-container">
              <div class="chip-image">
                <!-- 芯片主体 -->
                <div class="chip-body">
                  <div class="chip-label">STM32F103C8T6</div>
                </div>

                <!-- 左侧引脚 -->
                <div class="pins-left">
                  <div
                    v-for="pin in leftPins"
                    :key="pin.id"
                    class="pin-item"
                    :class="{
                      'selected': selectedPin?.id === pin.id,
                      'configured': pin.configured,
                      [`mode-${pin.mode}`]: true
                    }"
                    @click="selectPin(pin)"
                  >
                    <div class="pin-number">{{ pin.number }}</div>
                    <div class="pin-name">{{ pin.name }}</div>
                    <div class="pin-function">{{ pin.function }}</div>
                  </div>
                </div>

                <!-- 右侧引脚 -->
                <div class="pins-right">
                  <div
                    v-for="pin in rightPins"
                    :key="pin.id"
                    class="pin-item"
                    :class="{
                      'selected': selectedPin?.id === pin.id,
                      'configured': pin.configured,
                      [`mode-${pin.mode}`]: true
                    }"
                    @click="selectPin(pin)"
                  >
                    <div class="pin-number">{{ pin.number }}</div>
                    <div class="pin-name">{{ pin.name }}</div>
                    <div class="pin-function">{{ pin.function }}</div>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 选中的引脚
const selectedPin = ref(null);

// 搜索关键词
const searchKeyword = ref('');

// 引脚数据
const leftPins = ref([
  { id: 'PA0', number: '1', name: 'PA0', function: 'GPIO', mode: 'output', configured: true, pullMode: 'none', driveStrength: '4ma', speed: 'medium', defaultState: 'low', interruptMode: [], interruptPriority: 'medium', interruptCallback: '', pwmFrequency: 1000, pwmDutyCycle: 50, userLabel: '' },
  { id: 'PA1', number: '2', name: 'PA1', function: 'UART_TX', mode: 'uart', configured: true, pullMode: 'none', driveStrength: '4ma', speed: 'medium', defaultState: 'low', interruptMode: [], interruptPriority: 'medium', interruptCallback: '', pwmFrequency: 1000, pwmDutyCycle: 50, userLabel: '' },
  { id: 'PA2', number: '3', name: 'PA2', function: 'UART_RX', mode: 'uart', configured: true, pullMode: 'none', driveStrength: '4ma', speed: 'medium', defaultState: 'low', interruptMode: [], interruptPriority: 'medium', interruptCallback: '', pwmFrequency: 1000, pwmDutyCycle: 50, userLabel: '' },
  { id: 'PA3', number: '4', name: 'PA3', function: 'GPIO', mode: 'input', configured: false, pullMode: 'none', driveStrength: '4ma', speed: 'medium', defaultState: 'low', interruptMode: [], interruptPriority: 'medium', interruptCallback: '', pwmFrequency: 1000, pwmDutyCycle: 50, userLabel: '' },
]);

const rightPins = ref([
  { id: 'PB0', number: '9', name: 'PB0', function: 'GPIO', mode: 'output', configured: true, pullMode: 'none', driveStrength: '4ma', speed: 'medium', defaultState: 'low', interruptMode: [], interruptPriority: 'medium', interruptCallback: '', pwmFrequency: 1000, pwmDutyCycle: 50, userLabel: '' },
  { id: 'PB1', number: '10', name: 'PB1', function: 'GPIO', mode: 'input', configured: false, pullMode: 'none', driveStrength: '4ma', speed: 'medium', defaultState: 'low', interruptMode: [], interruptPriority: 'medium', interruptCallback: '', pwmFrequency: 1000, pwmDutyCycle: 50, userLabel: '' },
  { id: 'PB6', number: '15', name: 'PB6', function: 'I2C_SCL', mode: 'i2c', configured: true, pullMode: 'none', driveStrength: '4ma', speed: 'medium', defaultState: 'low', interruptMode: [], interruptPriority: 'medium', interruptCallback: '', pwmFrequency: 1000, pwmDutyCycle: 50, userLabel: '' },
  { id: 'PB7', number: '16', name: 'PB7', function: 'I2C_SDA', mode: 'i2c', configured: true, pullMode: 'none', driveStrength: '4ma', speed: 'medium', defaultState: 'low', interruptMode: [], interruptPriority: 'medium', interruptCallback: '', pwmFrequency: 1000, pwmDutyCycle: 50, userLabel: '' },
]);

// 合并所有引脚
const allPins = computed(() => {
  return [...leftPins.value, ...rightPins.value];
});

// 过滤后的引脚数据
const filteredPins = computed(() => {
  if (!searchKeyword.value) {
    return allPins.value;
  }

  const keyword = searchKeyword.value.toLowerCase();
  return allPins.value.filter(pin =>
    pin.name.toLowerCase().includes(keyword) ||
    pin.function.toLowerCase().includes(keyword) ||
    (pin.userLabel && pin.userLabel.toLowerCase().includes(keyword))
  );
});

// 表格列定义
const pinColumns = [
  {
    title: '引脚名称',
    dataIndex: 'name',
    key: 'pinName',
    width: 80,
    fixed: 'left',
  },
  {
    title: '引脚信号',
    dataIndex: 'function',
    key: 'signalOnPin',
    width: 100,
  },
  {
    title: 'GPIO输出电平',
    key: 'gpioOutputLevel',
    width: 120,
  },
  {
    title: 'GPIO模式',
    key: 'gpioMode',
    width: 100,
  },
  {
    title: '上拉/下拉',
    key: 'gpioPullUpDown',
    width: 100,
  },
  {
    title: '最大输出速度',
    key: 'maxOutputSpeed',
    width: 120,
  },
  {
    title: '用户标签',
    key: 'userLabel',
    width: 120,
  },
  {
    title: '修改状态',
    key: 'modified',
    width: 100,
  },
];

// 选择引脚
function selectPin(pin) {
  selectedPin.value = pin;
  console.log('选择引脚:', pin);
}

// 获取行样式类名
function getRowClassName(record) {
  return selectedPin.value?.id === record.id ? 'selected-row' : '';
}

// 获取输出电平颜色
function getOutputLevelColor(pin) {
  if (pin.mode === 'output') {
    return pin.defaultState === 'high' ? 'red' : 'green';
  }
  return 'default';
}

// 获取输出电平文本
function getOutputLevelText(pin) {
  if (pin.mode === 'output') {
    return pin.defaultState === 'high' ? '高电平' : '低电平';
  }
  return '-';
}

// 获取模式颜色
function getModeColor(mode) {
  const colorMap = {
    'input': 'blue',
    'output': 'green',
    'analog': 'purple',
    'pwm': 'orange',
    'uart': 'cyan',
    'spi': 'magenta',
    'i2c': 'geekblue'
  };
  return colorMap[mode] || 'default';
}

// 获取模式文本
function getModeText(mode) {
  const textMap = {
    'input': '输入',
    'output': '输出',
    'analog': '模拟',
    'pwm': 'PWM',
    'uart': 'UART',
    'spi': 'SPI',
    'i2c': 'I2C'
  };
  return textMap[mode] || mode;
}

// 获取上拉下拉文本
function getPullUpDownText(pullMode) {
  const textMap = {
    'none': '无',
    'pullup': '上拉',
    'pulldown': '下拉'
  };
  return textMap[pullMode] || pullMode;
}

// 获取速度文本
function getSpeedText(speed) {
  const textMap = {
    'low': '低速',
    'medium': '中速',
    'high': '高速'
  };
  return textMap[speed] || speed;
}

// 搜索处理
function handleSearch(value) {
  searchKeyword.value = value;
}

function handleSearchChange(e) {
  searchKeyword.value = e.target.value;
}

// 保存引脚配置
function savePinConfig() {
  if (selectedPin.value) {
    selectedPin.value.configured = true;
    console.log('保存引脚配置:', selectedPin.value);
  }
}

// 重置引脚配置
function resetPinConfig() {
  if (selectedPin.value) {
    // 重置为默认值
    selectedPin.value.mode = 'input';
    selectedPin.value.pullMode = 'none';
    selectedPin.value.driveStrength = '4ma';
    selectedPin.value.speed = 'medium';
    selectedPin.value.defaultState = 'low';
    selectedPin.value.interruptMode = [];
    selectedPin.value.interruptPriority = 'medium';
    selectedPin.value.interruptCallback = '';
    selectedPin.value.configured = false;
    console.log('重置引脚配置:', selectedPin.value);
  }
}

// 应用到所有引脚
function applyToAll() {
  if (selectedPin.value) {
    const config = {
      mode: selectedPin.value.mode,
      pullMode: selectedPin.value.pullMode,
      driveStrength: selectedPin.value.driveStrength,
      speed: selectedPin.value.speed,
      defaultState: selectedPin.value.defaultState,
      interruptMode: selectedPin.value.interruptMode,
      interruptPriority: selectedPin.value.interruptPriority,
      interruptCallback: selectedPin.value.interruptCallback
    };

    allPins.value.forEach(pin => {
      Object.assign(pin, config);
      pin.configured = true;
    });

    console.log('应用到所有引脚:', config);
  }
}

onMounted(() => {
  console.log('PinoutConfig Mode 组件已挂载');
});
</script>

<style lang="less" scoped>
.pinout-mode-container {
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

.main-layout {
  display: flex;
  gap: 24px;
  height: 100%;
}

.config-panel {
  flex: 1;
  min-width: 0;
}

.chip-panel {
  flex: 1;
  min-width: 0;
}

.config-card,
.chip-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pin-list-section {
  flex: 1;
  min-height: 0;

  h3 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 14px;
    font-weight: 600;
  }
}

.config-options-section {
  margin-top: 16px;

  h3 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 14px;
    font-weight: 600;
  }
}

.no-selection {
  margin-top: 16px;
  text-align: center;
}

.pin-name-cell {
  font-weight: 500;
  color: #1890ff;
}

.selected-row {
  background-color: #e6f7ff !important;
}

.chip-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 400px;
}

.chip-image {
  position: relative;
  width: 300px;
  height: 400px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chip-body {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 80px;
  background: #333;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  .chip-label {
    color: #fff;
    font-size: 10px;
    text-align: center;
    line-height: 1.2;
  }
}

.pins-left,
.pins-right {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.pins-left {
  left: -60px;
}

.pins-right {
  right: -60px;
}

.pin-item {
  width: 50px;
  height: 60px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 10px;
  text-align: center;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  }

  &.selected {
    border-color: #1890ff;
    background-color: #e6f7ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }

  &.configured {
    border-color: #52c41a;
  }

  .pin-number {
    font-weight: bold;
    color: #333;
    margin-bottom: 2px;
  }

  .pin-name {
    color: #1890ff;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .pin-function {
    color: #666;
    font-size: 8px;
  }
}

.mode-input {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.mode-output {
  border-color: #52c41a;
  background-color: #f6ffed;
}

.mode-analog {
  border-color: #722ed1;
  background-color: #f9f0ff;
}

.mode-pwm {
  border-color: #fa8c16;
  background-color: #fff7e6;
}

.mode-uart {
  border-color: #13c2c2;
  background-color: #e6fffb;
}

.mode-spi {
  border-color: #eb2f96;
  background-color: #fff0f6;
}

.mode-i2c {
  border-color: #2f54eb;
  background-color: #f0f5ff;
}

.unit-text {
  margin-left: 8px;
  color: #666;
  font-size: 12px;
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
