<template>
  <div class="detail-container">
    <div class="detail-header">
      <h3>单片机详细信息</h3>
      <a-button
        type="text"
        size="small"
        @click="goBackToSelect"
        class="back-btn"
      >
        <template #icon>
          <icon-font type="icon-arrow-left" />
        </template>
        返回选择
      </a-button>
    </div>

    <div class="detail-content">
      <!-- 基本信息 -->
      <div class="info-section">
        <h4>基本信息</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">型号：</span>
            <span class="value">{{ selectedMcu.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">系列：</span>
            <span class="value">{{ selectedMcu.series }}</span>
          </div>
          <div class="info-item">
            <span class="label">内核：</span>
            <span class="value">{{ selectedMcu.core }}</span>
          </div>
          <div class="info-item">
            <span class="label">主频：</span>
            <span class="value">{{ selectedMcu.frequency }}</span>
          </div>
          <div class="info-item">
            <span class="label">Flash：</span>
            <span class="value">{{ selectedMcu.flash }}</span>
          </div>
          <div class="info-item">
            <span class="label">RAM：</span>
            <span class="value">{{ selectedMcu.ram }}</span>
          </div>
          <div class="info-item">
            <span class="label">工作电压：</span>
            <span class="value">{{ selectedMcu.voltage }}</span>
          </div>
          <div class="info-item">
            <span class="label">工作温度：</span>
            <span class="value">{{ selectedMcu.temperature }}</span>
          </div>
        </div>
      </div>

      <!-- 引脚信息 -->
      <div class="info-section">
        <h4>引脚信息</h4>
        <div class="pins-container">
          <div class="pins-filter">
            <a-input-search
              v-model:value="pinFilter"
              placeholder="搜索引脚"
              style="width: 200px"
              @search="onPinSearch"
            />
            <a-select
              v-model:value="pinTypeFilter"
              placeholder="按类型筛选"
              style="width: 120px; margin-left: 8px"
              @change="onPinTypeChange"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="GPIO">GPIO</a-select-option>
              <a-select-option value="UART">UART</a-select-option>
              <a-select-option value="SPI">SPI</a-select-option>
              <a-select-option value="I2C">I2C</a-select-option>
              <a-select-option value="ADC">ADC</a-select-option>
              <a-select-option value="TIM">TIM</a-select-option>
              <a-select-option value="USB">USB</a-select-option>
              <a-select-option value="SWD">SWD</a-select-option>
              <a-select-option value="JTAG">JTAG</a-select-option>
            </a-select>
          </div>

          <div class="pins-grid">
            <div
              v-for="pin in filteredPins"
              :key="pin.name"
              class="pin-item"
              :class="{
                'highlighted': highlightedPins.includes(pin.name),
                [`type-${pin.type.toLowerCase()}`]: true
              }"
              @click="togglePinHighlight(pin.name)"
            >
              <span class="pin-name">{{ pin.name }}</span>
              <span class="pin-type">{{ pin.type }}</span>
              <span class="pin-desc">{{ pin.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 外设信息 -->
      <div class="info-section">
        <h4>外设信息</h4>
        <div class="peripherals-grid">
          <div
            v-for="peripheral in selectedMcu.peripherals"
            :key="peripheral.name"
            class="peripheral-item"
          >
            <div class="peripheral-header">
              <span class="peripheral-name">{{ peripheral.name }}</span>
              <span class="peripheral-count">{{ peripheral.count }}个</span>
            </div>
            <div class="peripheral-desc">{{ peripheral.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import globalComponents from '@/components/global';

const { iconFont: IconFont } = globalComponents;

const router = useRouter();

// 选中的单片机信息
const selectedMcu = ref({
  name: 'STM32F103C8T6',
  series: 'STM32F1',
  core: 'ARM Cortex-M3',
  frequency: '72MHz',
  flash: '64KB',
  ram: '20KB',
  voltage: '2.0V - 3.6V',
  temperature: '-40°C to +85°C',
  pins: [
    { name: 'PA0', type: 'ADC', description: 'ADC输入通道0' },
    { name: 'PA1', type: 'ADC', description: 'ADC输入通道1' },
    { name: 'PA2', type: 'UART', description: 'UART2_TX' },
    { name: 'PA3', type: 'UART', description: 'UART2_RX' },
    { name: 'PA4', type: 'SPI', description: 'SPI1_NSS' },
    { name: 'PA5', type: 'SPI', description: 'SPI1_SCK' },
    { name: 'PA6', type: 'SPI', description: 'SPI1_MISO' },
    { name: 'PA7', type: 'SPI', description: 'SPI1_MOSI' },
    { name: 'PA8', type: 'TIM', description: 'TIM1_CH1' },
    { name: 'PA9', type: 'UART', description: 'UART1_TX' },
    { name: 'PA10', type: 'UART', description: 'UART1_RX' },
    { name: 'PA11', type: 'USB', description: 'USB_DM' },
    { name: 'PA12', type: 'USB', description: 'USB_DP' },
    { name: 'PA13', type: 'SWD', description: 'SWDIO' },
    { name: 'PA14', type: 'SWD', description: 'SWCLK' },
    { name: 'PA15', type: 'JTAG', description: 'JTDI' },
    { name: 'PB0', type: 'ADC', description: 'ADC输入通道8' },
    { name: 'PB1', type: 'ADC', description: 'ADC输入通道9' },
    { name: 'PB2', type: 'BOOT', description: 'BOOT1' },
    { name: 'PB3', type: 'JTAG', description: 'JTDO' },
    { name: 'PB4', type: 'JTAG', description: 'JTRST' },
    { name: 'PB5', type: 'I2C', description: 'I2C1_SMBA' },
    { name: 'PB6', type: 'I2C', description: 'I2C1_SCL' },
    { name: 'PB7', type: 'I2C', description: 'I2C1_SDA' },
    { name: 'PB8', type: 'I2C', description: 'I2C1_SCL' },
    { name: 'PB9', type: 'I2C', description: 'I2C1_SDA' },
    { name: 'PB10', type: 'I2C', description: 'I2C2_SCL' },
    { name: 'PB11', type: 'I2C', description: 'I2C2_SDA' },
    { name: 'PB12', type: 'SPI', description: 'SPI2_NSS' },
    { name: 'PB13', type: 'SPI', description: 'SPI2_SCK' },
    { name: 'PB14', type: 'SPI', description: 'SPI2_MISO' },
    { name: 'PB15', type: 'SPI', description: 'SPI2_MOSI' },
    { name: 'PC13', type: 'GPIO', description: '通用GPIO' },
    { name: 'PC14', type: 'OSC', description: '外部晶振' },
    { name: 'PC15', type: 'OSC', description: '外部晶振' }
  ],
  peripherals: [
    { name: 'GPIO', count: 37, description: '通用输入输出端口' },
    { name: 'ADC', count: 2, description: '12位模数转换器' },
    { name: 'UART', count: 3, description: '通用异步收发器' },
    { name: 'SPI', count: 2, description: '串行外设接口' },
    { name: 'I2C', count: 2, description: '内部集成电路总线' },
    { name: 'TIM', count: 4, description: '通用定时器' },
    { name: 'USB', count: 1, description: 'USB设备接口' },
    { name: 'CAN', count: 1, description: '控制器局域网' },
    { name: 'DMA', count: 2, description: '直接内存访问' }
  ]
});

// 高亮的引脚
const highlightedPins = ref([]);

// 引脚筛选
const pinFilter = ref('');
const pinTypeFilter = ref('');

// 筛选后的引脚
const filteredPins = computed(() => {
  let pins = selectedMcu.value.pins;

  if (pinFilter.value) {
    pins = pins.filter(pin =>
      pin.name.toLowerCase().includes(pinFilter.value.toLowerCase()) ||
      pin.description.toLowerCase().includes(pinFilter.value.toLowerCase())
    );
  }

  if (pinTypeFilter.value) {
    pins = pins.filter(pin => pin.type === pinTypeFilter.value);
  }

  return pins;
});

// 切换引脚高亮
function togglePinHighlight(pinName) {
  const index = highlightedPins.value.indexOf(pinName);
  if (index > -1) {
    highlightedPins.value.splice(index, 1);
  } else {
    highlightedPins.value.push(pinName);
  }
}

// 返回选择页面
function goBackToSelect() {
  router.push('/microcontroller/select');
}

// 引脚搜索
function onPinSearch(value) {
  pinFilter.value = value;
}

// 引脚类型筛选
function onPinTypeChange(value) {
  pinTypeFilter.value = value;
}
</script>

<style lang="less" scoped>
.detail-container {
  height: 100%;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.detail-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: #1890ff;
  }

  .back-btn {
    color: #666;

    &:hover {
      color: #1890ff;
    }
  }
}

.detail-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 24px;

  h4 {
    margin: 0 0 16px 0;
    color: #1890ff;
    font-size: 16px;
    font-weight: 500;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .info-item {
    display: flex;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 4px;

    .label {
      width: 80px;
      color: #666;
      font-weight: 500;
    }

    .value {
      color: #333;
      flex: 1;
    }
  }
}

.pins-container {
  .pins-filter {
    display: flex;
    margin-bottom: 16px;
  }

  .pins-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }

  .pin-item {
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;

    &:hover {
      border-color: #1890ff;
      background: #f0f8ff;
    }

    &.highlighted {
      background: #1890ff;
      color: white;
      border-color: #1890ff;
    }

    .pin-name {
      display: block;
      font-weight: 500;
      font-size: 12px;
    }

    .pin-type {
      display: block;
      font-size: 10px;
      opacity: 0.8;
      margin-top: 2px;
    }

    .pin-desc {
      display: block;
      font-size: 9px;
      opacity: 0.7;
      margin-top: 2px;
      line-height: 1.2;
    }
  }
}

.peripherals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;

  .peripheral-item {
    padding: 12px;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    background: #fafbfc;

    .peripheral-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .peripheral-name {
        font-weight: 500;
        color: #1890ff;
      }

      .peripheral-count {
        background: #1890ff;
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 12px;
      }
    }

    .peripheral-desc {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }
  }
}

// 引脚类型颜色
.pin-item.type-gpio { border-left: 3px solid #52c41a; }
.pin-item.type-uart { border-left: 3px solid #1890ff; }
.pin-item.type-spi { border-left: 3px solid #722ed1; }
.pin-item.type-i2c { border-left: 3px solid #fa8c16; }
.pin-item.type-adc { border-left: 3px solid #eb2f96; }
.pin-item.type-tim { border-left: 3px solid #13c2c2; }
.pin-item.type-usb { border-left: 3px solid #f5222d; }
.pin-item.type-swd { border-left: 3px solid #faad14; }
.pin-item.type-jtag { border-left: 3px solid #a0d911; }
</style>
