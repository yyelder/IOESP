<template>
  <div class="pcc-tools-container">
    <div class="page-header">
      <h2>PCC工具</h2>
      <p>引脚配置检查和验证工具</p>
    </div>

    <div class="content-section">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-card title="配置检查" class="pcc-card">
            <a-space direction="vertical" style="width: 100%">
              <a-form layout="vertical">
                <a-form-item label="检查类型">
                  <a-select v-model="checkType" placeholder="选择检查类型">
                    <a-select-option value="conflict">引脚冲突检查</a-select-option>
                    <a-select-option value="function">功能兼容性检查</a-select-option>
                    <a-select-option value="electrical">电气特性检查</a-select-option>
                    <a-select-option value="timing">时序检查</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="检查范围">
                  <a-checkbox-group v-model="checkScope">
                    <a-checkbox value="gpio">GPIO配置</a-checkbox>
                    <a-checkbox value="uart">UART配置</a-checkbox>
                    <a-checkbox value="spi">SPI配置</a-checkbox>
                    <a-checkbox value="i2c">I2C配置</a-checkbox>
                    <a-checkbox value="adc">ADC配置</a-checkbox>
                    <a-checkbox value="pwm">PWM配置</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>

                <a-form-item label="检查选项">
                  <a-checkbox-group v-model="checkOptions">
                    <a-checkbox value="warnings">显示警告</a-checkbox>
                    <a-checkbox value="errors">显示错误</a-checkbox>
                    <a-checkbox value="suggestions">显示建议</a-checkbox>
                    <a-checkbox value="auto_fix">自动修复</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </a-form>

              <a-button type="primary" block @click="startCheck">开始检查</a-button>
              <a-button block @click="clearResults">清除结果</a-button>
            </a-space>
          </a-card>

          <a-card title="检查统计" class="pcc-card" style="margin-top: 16px;">
            <a-statistic title="总检查项" :value="totalChecks" />
            <a-statistic title="通过" :value="passedChecks" style="margin-top: 16px;" />
            <a-statistic title="警告" :value="warningChecks" style="margin-top: 16px;" />
            <a-statistic title="错误" :value="errorChecks" style="margin-top: 16px;" />
          </a-card>
        </a-col>

        <a-col :span="16">
          <a-card title="检查结果" class="pcc-card">
            <a-tabs v-model="resultTab">
              <a-tab-pane key="summary" tab="摘要">
                <a-alert
                  v-if="checkSummary"
                  :message="checkSummary.title"
                  :description="checkSummary.description"
                  :type="checkSummary.type"
                  show-icon
                  style="margin-bottom: 16px"
                />

                <a-progress
                  :percent="checkProgress"
                  :status="checkStatus"
                  style="margin-bottom: 16px"
                />

                <a-list
                  :data-source="checkResults"
                  :pagination="{ pageSize: 10 }"
                  size="small"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta>
                        <template #title>
                          <span :class="`result-${item.level}`">{{ item.title }}</span>
                        </template>
                        <template #description>
                          <span>{{ item.description }}</span>
                        </template>
                      </a-list-item-meta>
                      <template #actions>
                        <a-tag :color="getTagColor(item.level)">{{ item.level.toUpperCase() }}</a-tag>
                        <a-button type="link" size="small" @click="viewDetail(item)">详情</a-button>
                        <a-button v-if="item.fixable" type="link" size="small" @click="autoFix(item)">自动修复</a-button>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>
              </a-tab-pane>

              <a-tab-pane key="details" tab="详细信息">
                <a-table
                  :columns="detailColumns"
                  :data-source="detailResults"
                  :pagination="{ pageSize: 20 }"
                  size="small"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'level'">
                      <a-tag :color="getTagColor(record.level)">{{ record.level.toUpperCase() }}</a-tag>
                    </template>
                    <template v-else-if="column.key === 'action'">
                      <a-space>
                        <a-button type="link" size="small" @click="viewDetail(record)">查看</a-button>
                        <a-button v-if="record.fixable" type="link" size="small" @click="autoFix(record)">修复</a-button>
                      </a-space>
                    </template>
                  </template>
                </a-table>
              </a-tab-pane>

              <a-tab-pane key="report" tab="检查报告">
                <a-space direction="vertical" style="width: 100%">
                  <a-space>
                    <a-button type="primary" @click="generateReport">生成报告</a-button>
                    <a-button @click="exportReport">导出报告</a-button>
                    <a-button @click="printReport">打印报告</a-button>
                  </a-space>

                  <a-card title="检查报告" size="small">
                    <pre class="report-content">{{ reportContent }}</pre>
                  </a-card>
                </a-space>
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

const checkType = ref('conflict');
const checkScope = ref(['gpio', 'uart']);
const checkOptions = ref(['warnings', 'errors']);
const resultTab = ref('summary');
const checkProgress = ref(0);
const checkStatus = ref('normal');

const totalChecks = ref(156);
const passedChecks = ref(142);
const warningChecks = ref(8);
const errorChecks = ref(6);

const checkSummary = ref({
  title: '检查完成',
  description: `共检查 ${totalChecks.value} 项，通过 ${passedChecks.value} 项，警告 ${warningChecks.value} 项，错误 ${errorChecks.value} 项`,
  type: 'success'
});

const checkResults = ref([
  {
    id: 1,
    title: '引脚PA0和PA1功能冲突',
    description: 'PA0配置为UART_TX，PA1配置为UART_RX，但两者都配置为输出模式',
    level: 'error',
    fixable: true
  },
  {
    id: 2,
    title: 'PWM频率超出范围',
    description: 'PWM频率设置为100kHz，超出该引脚的推荐范围(1kHz-50kHz)',
    level: 'warning',
    fixable: true
  },
  {
    id: 3,
    title: 'ADC采样时间过短',
    description: 'ADC采样时间设置为1.5个周期，建议至少3个周期以确保采样精度',
    level: 'warning',
    fixable: false
  }
]);

const detailColumns = [
  {
    title: '检查项',
    dataIndex: 'item',
    key: 'item',
  },
  {
    title: '引脚',
    dataIndex: 'pin',
    key: 'pin',
  },
  {
    title: '问题描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '级别',
    key: 'level',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const detailResults = ref([
  {
    key: '1',
    item: '引脚冲突检查',
    pin: 'PA0, PA1',
    description: 'UART引脚配置冲突',
    level: 'error',
    fixable: true
  },
  {
    key: '2',
    item: 'PWM配置检查',
    pin: 'PA2',
    description: 'PWM频率超出范围',
    level: 'warning',
    fixable: true
  }
]);

const reportContent = ref(`PCC检查报告
================

检查时间: 2024-01-29 15:30:00
检查类型: 引脚冲突检查
检查范围: GPIO, UART

检查统计:
- 总检查项: 156
- 通过: 142
- 警告: 8
- 错误: 6

错误详情:
1. 引脚PA0和PA1功能冲突
   - 问题: UART引脚配置冲突
   - 建议: 检查UART配置，确保TX和RX引脚正确配置

2. 引脚PA3驱动能力不足
   - 问题: 驱动能力设置为2mA，但负载需要8mA
   - 建议: 将驱动能力设置为8mA或更高

警告详情:
1. PWM频率超出范围
   - 问题: PWM频率设置为100kHz
   - 建议: 将频率调整到1kHz-50kHz范围内

2. ADC采样时间过短
   - 问题: 采样时间设置为1.5个周期
   - 建议: 将采样时间设置为至少3个周期

检查完成！`);

function startCheck() {
  checkProgress.value = 0;
  checkStatus.value = 'active';

  const interval = setInterval(() => {
    checkProgress.value += 20;

    if (checkProgress.value >= 100) {
      checkStatus.value = 'success';
      clearInterval(interval);
    }
  }, 500);
}

function clearResults() {
  checkResults.value = [];
  detailResults.value = [];
  checkProgress.value = 0;
  checkStatus.value = 'normal';
}

function viewDetail(item) {
  console.log('查看详情:', item);
}

function autoFix(item) {
  console.log('自动修复:', item);
}

function getTagColor(level) {
  switch (level) {
    case 'error': return 'red';
    case 'warning': return 'orange';
    case 'info': return 'blue';
    default: return 'green';
  }
}

function generateReport() {
  console.log('生成报告');
}

function exportReport() {
  console.log('导出报告');
}

function printReport() {
  console.log('打印报告');
}
</script>

<style lang="less" scoped>
.pcc-tools-container {
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

.pcc-card {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.result-error {
  color: #ff4d4f;
  font-weight: 500;
}

.result-warning {
  color: #faad14;
  font-weight: 500;
}

.result-info {
  color: #1890ff;
  font-weight: 500;
}

.result-success {
  color: #52c41a;
  font-weight: 500;
}

.report-content {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
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
