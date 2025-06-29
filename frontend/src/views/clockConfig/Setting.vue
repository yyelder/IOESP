<template>
  <div class="clock-setting-container">
    <div class="page-header">
      <h2>时钟设置</h2>
      <p>高级时钟设置和优化选项</p>
    </div>

    <div class="content-section">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="PLL配置" class="setting-card">
            <a-form layout="vertical">
              <a-form-item label="PLL倍频系数">
                <a-select v-model="pllMultiplier" placeholder="选择倍频系数">
                  <a-select-option value="2">2倍</a-select-option>
                  <a-select-option value="3">3倍</a-select-option>
                  <a-select-option value="4">4倍</a-select-option>
                  <a-select-option value="5">5倍</a-select-option>
                  <a-select-option value="6">6倍</a-select-option>
                  <a-select-option value="7">7倍</a-select-option>
                  <a-select-option value="8">8倍</a-select-option>
                  <a-select-option value="9">9倍</a-select-option>
                  <a-select-option value="10">10倍</a-select-option>
                  <a-select-option value="11">11倍</a-select-option>
                  <a-select-option value="12">12倍</a-select-option>
                  <a-select-option value="13">13倍</a-select-option>
                  <a-select-option value="14">14倍</a-select-option>
                  <a-select-option value="15">15倍</a-select-option>
                  <a-select-option value="16">16倍</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="PLL输入分频">
                <a-select v-model="pllInputDiv" placeholder="选择输入分频">
                  <a-select-option value="2">2分频</a-select-option>
                  <a-select-option value="3">3分频</a-select-option>
                  <a-select-option value="4">4分频</a-select-option>
                  <a-select-option value="5">5分频</a-select-option>
                  <a-select-option value="6">6分频</a-select-option>
                  <a-select-option value="7">7分频</a-select-option>
                  <a-select-option value="8">8分频</a-select-option>
                  <a-select-option value="9">9分频</a-select-option>
                  <a-select-option value="10">10分频</a-select-option>
                  <a-select-option value="11">11分频</a-select-option>
                  <a-select-option value="12">12分频</a-select-option>
                  <a-select-option value="13">13分频</a-select-option>
                  <a-select-option value="14">14分频</a-select-option>
                  <a-select-option value="15">15分频</a-select-option>
                  <a-select-option value="16">16分频</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="PLL输出分频">
                <a-select v-model="pllOutputDiv" placeholder="选择输出分频">
                  <a-select-option value="2">2分频</a-select-option>
                  <a-select-option value="4">4分频</a-select-option>
                  <a-select-option value="6">6分频</a-select-option>
                  <a-select-option value="8">8分频</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="PLL状态">
                <a-tag :color="pllStatus === 'locked' ? 'green' : 'red'">
                  {{ pllStatus === 'locked' ? '已锁定' : '未锁定' }}
                </a-tag>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <a-col :span="12">
          <a-card title="时钟优化" class="setting-card">
            <a-form layout="vertical">
              <a-form-item label="低功耗模式">
                <a-switch v-model="lowPowerMode" />
                <span class="switch-label">启用低功耗时钟模式</span>
              </a-form-item>

              <a-form-item label="动态频率调节">
                <a-switch v-model="dynamicFreqScaling" />
                <span class="switch-label">启用动态频率调节</span>
              </a-form-item>

              <a-form-item label="时钟监控">
                <a-switch v-model="clockMonitoring" />
                <span class="switch-label">启用时钟监控</span>
              </a-form-item>

              <a-form-item label="时钟故障检测">
                <a-switch v-model="clockFaultDetection" />
                <span class="switch-label">启用时钟故障检测</span>
              </a-form-item>

              <a-form-item label="自动校准">
                <a-switch v-model="autoCalibration" />
                <span class="switch-label">启用自动校准</span>
              </a-form-item>

              <a-form-item label="时钟备份">
                <a-switch v-model="clockBackup" />
                <span class="switch-label">启用时钟备份</span>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
      </a-row>

      <a-card title="时钟配置向导" class="setting-card">
        <a-steps :current="currentStep" direction="vertical">
          <a-step title="选择时钟源" description="选择主时钟源和备用时钟源" />
          <a-step title="配置PLL" description="设置PLL倍频和分频参数" />
          <a-step title="设置总线频率" description="配置AHB、APB1、APB2总线频率" />
          <a-step title="启用外设时钟" description="选择需要启用的外设时钟" />
          <a-step title="应用配置" description="应用所有时钟配置" />
        </a-steps>

        <a-divider />

        <a-space>
          <a-button @click="prevStep" :disabled="currentStep === 0">上一步</a-button>
          <a-button type="primary" @click="nextStep" :disabled="currentStep === 4">下一步</a-button>
          <a-button @click="finishWizard" :disabled="currentStep !== 4">完成配置</a-button>
        </a-space>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pllMultiplier = ref('9');
const pllInputDiv = ref('1');
const pllOutputDiv = ref('2');
const pllStatus = ref('locked');

const lowPowerMode = ref(false);
const dynamicFreqScaling = ref(true);
const clockMonitoring = ref(true);
const clockFaultDetection = ref(true);
const autoCalibration = ref(false);
const clockBackup = ref(true);

const currentStep = ref(0);

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function nextStep() {
  if (currentStep.value < 4) {
    currentStep.value++;
  }
}

function finishWizard() {
  console.log('完成时钟配置向导');
}
</script>

<style lang="less" scoped>
.clock-setting-container {
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
  .setting-card {
    margin-bottom: 24px;
  }
}

.switch-label {
  margin-left: 8px;
  color: #333;
}
</style>
