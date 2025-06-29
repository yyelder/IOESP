<template>
  <div class="clock-config-container">
    <div class="page-header">
      <h2>时钟配置</h2>
      <p>配置单片机的时钟系统和频率设置</p>
    </div>

    <div class="content-section">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="系统时钟配置" class="clock-card">
            <a-form layout="vertical">
              <a-form-item label="主时钟源">
                <a-select v-model="mainClockSource" placeholder="选择主时钟源">
                  <a-select-option value="hsi">HSI (内部高速时钟)</a-select-option>
                  <a-select-option value="hse">HSE (外部高速时钟)</a-select-option>
                  <a-select-option value="lsi">LSI (内部低速时钟)</a-select-option>
                  <a-select-option value="lse">LSE (外部低速时钟)</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="系统时钟频率">
                <a-input-number v-model="systemClockFreq" :min="1" :max="200" style="width: 100%" />
                <span class="unit-text">MHz</span>
              </a-form-item>

              <a-form-item label="AHB总线频率">
                <a-input-number v-model="ahbFreq" :min="1" :max="200" style="width: 100%" />
                <span class="unit-text">MHz</span>
              </a-form-item>

              <a-form-item label="APB1总线频率">
                <a-input-number v-model="apb1Freq" :min="1" :max="50" style="width: 100%" />
                <span class="unit-text">MHz</span>
              </a-form-item>

              <a-form-item label="APB2总线频率">
                <a-input-number v-model="apb2Freq" :min="1" :max="100" style="width: 100%" />
                <span class="unit-text">MHz</span>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <a-col :span="12">
          <a-card title="外设时钟配置" class="clock-card">
            <a-form layout="vertical">
              <a-form-item label="UART时钟">
                <a-switch v-model="uartClockEnabled" />
                <span class="switch-label">启用UART时钟</span>
              </a-form-item>

              <a-form-item label="SPI时钟">
                <a-switch v-model="spiClockEnabled" />
                <span class="switch-label">启用SPI时钟</span>
              </a-form-item>

              <a-form-item label="I2C时钟">
                <a-switch v-model="i2cClockEnabled" />
                <span class="switch-label">启用I2C时钟</span>
              </a-form-item>

              <a-form-item label="ADC时钟">
                <a-switch v-model="adcClockEnabled" />
                <span class="switch-label">启用ADC时钟</span>
              </a-form-item>

              <a-form-item label="定时器时钟">
                <a-switch v-model="timerClockEnabled" />
                <span class="switch-label">启用定时器时钟</span>
              </a-form-item>

              <a-form-item label="DMA时钟">
                <a-switch v-model="dmaClockEnabled" />
                <span class="switch-label">启用DMA时钟</span>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
      </a-row>

      <a-card title="时钟状态监控" class="clock-card">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-statistic title="系统时钟" :value="systemClockFreq" suffix="MHz" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="AHB总线" :value="ahbFreq" suffix="MHz" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="APB1总线" :value="apb1Freq" suffix="MHz" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="APB2总线" :value="apb2Freq" suffix="MHz" />
          </a-col>
        </a-row>

        <a-divider />

        <a-space>
          <a-button type="primary" @click="applyClockConfig">应用配置</a-button>
          <a-button @click="resetClockConfig">重置配置</a-button>
          <a-button @click="autoConfig">自动配置</a-button>
        </a-space>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const mainClockSource = ref('hsi');
const systemClockFreq = ref(72);
const ahbFreq = ref(72);
const apb1Freq = ref(36);
const apb2Freq = ref(72);

const uartClockEnabled = ref(true);
const spiClockEnabled = ref(false);
const i2cClockEnabled = ref(false);
const adcClockEnabled = ref(true);
const timerClockEnabled = ref(true);
const dmaClockEnabled = ref(true);

function applyClockConfig() {
  console.log('应用时钟配置');
}

function resetClockConfig() {
  console.log('重置时钟配置');
}

function autoConfig() {
  console.log('自动配置时钟');
}
</script>

<style lang="less" scoped>
.clock-config-container {
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
  .clock-card {
    margin-bottom: 24px;
  }
}

.unit-text {
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}

.switch-label {
  margin-left: 8px;
  color: #333;
}
</style>
