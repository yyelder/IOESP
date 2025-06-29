<template>
  <div class="microcontroller-detail">
    <div class="detail-header">
      <a-page-header
        :title="selectedMcu?.name || '单片机详情'"
        :sub-title="selectedMcu?.description"
        @back="goBack"
      >
        <template #extra>
          <a-button type="primary" @click="goToSelectPage">
            重新选择
          </a-button>
        </template>
      </a-page-header>
    </div>

    <div v-if="selectedMcu" class="detail-content">
      <a-row :gutter="[24, 24]">
        <!-- 基本信息 -->
        <a-col :span="12">
          <a-card title="基本信息" class="detail-card">
            <div class="mcu-image-large">
              <img :src="selectedMcu.image" :alt="selectedMcu.name" />
            </div>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="型号名称">
                {{ selectedMcu.name }}
              </a-descriptions-item>
              <a-descriptions-item label="架构">
                <a-tag color="blue">{{ selectedMcu.architecture }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="主频">
                <a-tag color="green">{{ selectedMcu.frequency }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Flash容量">
                <a-tag color="orange">{{ selectedMcu.flash }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="描述">
                {{ selectedMcu.description }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>

        <!-- 技术规格 -->
        <a-col :span="12">
          <a-card title="技术规格" class="detail-card">
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="内核类型">
                {{ getKernelType(selectedMcu.architecture) }}
              </a-descriptions-item>
              <a-descriptions-item label="工作电压">
                {{ getVoltage(selectedMcu.id) }}
              </a-descriptions-item>
              <a-descriptions-item label="GPIO数量">
                {{ getGPIO(selectedMcu.id) }}
              </a-descriptions-item>
              <a-descriptions-item label="通信接口">
                {{ getInterfaces(selectedMcu.id) }}
              </a-descriptions-item>
              <a-descriptions-item label="开发环境">
                {{ getDevEnvironment(selectedMcu.id) }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>

        <!-- 应用场景 -->
        <a-col :span="24">
          <a-card title="应用场景" class="detail-card">
            <a-row :gutter="[16, 16]">
              <a-col :span="6" v-for="(scene, index) in getApplicationScenes(selectedMcu.id)" :key="index">
                <a-card size="small" class="scene-card">
                  <template #cover>
                    <div class="scene-icon">
                      <icon-font :type="scene.icon" />
                    </div>
                  </template>
                  <a-card-meta :title="scene.title" :description="scene.description" />
                </a-card>
              </a-col>
            </a-row>
          </a-card>
        </a-col>

        <!-- 开发资源 -->
        <a-col :span="24">
          <a-card title="开发资源" class="detail-card">
            <a-list :data-source="getDevResources(selectedMcu.id)" item-layout="horizontal">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #avatar>
                      <a-avatar :icon="item.icon" />
                    </template>
                    <template #title>
                      <a :href="item.url" target="_blank">{{ item.title }}</a>
                    </template>
                    <template #description>
                      {{ item.description }}
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div v-else class="no-mcu-selected">
      <a-empty description="未选择单片机型号">
        <a-button type="primary" @click="goToSelectPage">
          选择型号
        </a-button>
      </a-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedMcu = ref(null);

onMounted(() => {
  loadSelectedMcu();
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

function goBack() {
  router.back();
}

function goToSelectPage() {
  router.push('/microcontroller-select');
}

function getKernelType(architecture) {
  const kernelMap = {
    'ARM Cortex-M3': '32位ARM Cortex-M3内核',
    'ARM Cortex-M4': '32位ARM Cortex-M4内核',
    'ARM Cortex-M0+': '32位ARM Cortex-M0+内核',
    'Tensilica LX6': '32位Tensilica LX6双核',
    'AVR': '8位AVR内核'
  };
  return kernelMap[architecture] || architecture;
}

function getVoltage(mcuId) {
  const voltageMap = {
    'stm32f103': '3.3V',
    'stm32f407': '3.3V',
    'esp32': '3.3V',
    'arduino-uno': '5V',
    'raspberry-pi-pico': '3.3V',
    'nrf52840': '3.3V'
  };
  return voltageMap[mcuId] || '3.3V';
}

function getGPIO(mcuId) {
  const gpioMap = {
    'stm32f103': '37个GPIO',
    'stm32f407': '114个GPIO',
    'esp32': '34个GPIO',
    'arduino-uno': '14个数字GPIO + 6个模拟GPIO',
    'raspberry-pi-pico': '26个GPIO',
    'nrf52840': '48个GPIO'
  };
  return gpioMap[mcuId] || '多个GPIO';
}

function getInterfaces(mcuId) {
  const interfaceMap = {
    'stm32f103': 'UART, SPI, I2C, CAN, USB',
    'stm32f407': 'UART, SPI, I2C, CAN, USB, Ethernet',
    'esp32': 'UART, SPI, I2C, WiFi, Bluetooth',
    'arduino-uno': 'UART, SPI, I2C',
    'raspberry-pi-pico': 'UART, SPI, I2C, USB',
    'nrf52840': 'UART, SPI, I2C, USB, Bluetooth'
  };
  return interfaceMap[mcuId] || '多种通信接口';
}

function getDevEnvironment(mcuId) {
  const envMap = {
    'stm32f103': 'STM32CubeIDE, Keil MDK, IAR',
    'stm32f407': 'STM32CubeIDE, Keil MDK, IAR',
    'esp32': 'ESP-IDF, Arduino IDE, PlatformIO',
    'arduino-uno': 'Arduino IDE, PlatformIO',
    'raspberry-pi-pico': 'MicroPython, C/C++, Arduino',
    'nrf52840': 'nRF5 SDK, Arduino IDE, PlatformIO'
  };
  return envMap[mcuId] || '多种开发环境';
}

function getApplicationScenes(mcuId) {
  const sceneMap = {
    'stm32f103': [
      { title: '工业控制', description: 'PLC、传感器控制', icon: 'icon-gongye' },
      { title: '消费电子', description: '智能家电、玩具', icon: 'icon-dianzi' },
      { title: '汽车电子', description: '车载设备、仪表', icon: 'icon-qiche' },
      { title: '医疗设备', description: '监护仪、诊断设备', icon: 'icon-yiliao' }
    ],
    'esp32': [
      { title: '物联网', description: '智能家居、传感器网络', icon: 'icon-wulianwang' },
      { title: '可穿戴设备', description: '智能手表、健康监测', icon: 'icon-kechuandai' },
      { title: '智能音箱', description: '语音助手、音频处理', icon: 'icon-yinxiang' },
      { title: '机器人', description: '教育机器人、服务机器人', icon: 'icon-jiqiren' }
    ],
    'arduino-uno': [
      { title: '教育学习', description: '编程入门、电子制作', icon: 'icon-jiaoyu' },
      { title: '原型开发', description: '快速验证、概念设计', icon: 'icon-yuanxing' },
      { title: 'DIY项目', description: '个人制作、创意项目', icon: 'icon-diy' },
      { title: '艺术装置', description: '互动艺术、灯光控制', icon: 'icon-yishu' }
    ]
  };

  return sceneMap[mcuId] || [
    { title: '通用应用', description: '各种嵌入式应用', icon: 'icon-tongyong' },
    { title: '控制系统', description: '自动化控制', icon: 'icon-kongzhi' },
    { title: '数据采集', description: '传感器数据采集', icon: 'icon-shuju' },
    { title: '通信设备', description: '无线通信设备', icon: 'icon-tongxin' }
  ];
}

function getDevResources(mcuId) {
  const resourceMap = {
    'stm32f103': [
      { title: 'STM32CubeIDE', description: '官方集成开发环境', url: 'https://www.st.com/en/development-tools/stm32cubeide.html', icon: 'icon-ide' },
      { title: 'STM32 HAL库', description: '硬件抽象层库', url: 'https://www.st.com/en/embedded-software/stm32cube-mcu-mpu-packages.html', icon: 'icon-kucun' },
      { title: '数据手册', description: '详细技术规格文档', url: 'https://www.st.com/en/microcontrollers-microprocessors/stm32f103.html', icon: 'icon-wendang' },
      { title: '参考手册', description: '编程参考指南', url: 'https://www.st.com/en/microcontrollers-microprocessors/stm32f103.html', icon: 'icon-can kao' }
    ],
    'esp32': [
      { title: 'ESP-IDF', description: '官方开发框架', url: 'https://docs.espressif.com/projects/esp-idf/', icon: 'icon-ide' },
      { title: 'Arduino ESP32', description: 'Arduino兼容库', url: 'https://github.com/espressif/arduino-esp32', icon: 'icon-kucun' },
      { title: '技术参考手册', description: 'ESP32技术文档', url: 'https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf', icon: 'icon-wendang' },
      { title: '示例代码', description: '官方示例项目', url: 'https://github.com/espressif/esp-idf/tree/master/examples', icon: 'icon-daima' }
    ]
  };

  return resourceMap[mcuId] || [
    { title: '官方文档', description: '查看官方技术文档', url: '#', icon: 'icon-wendang' },
    { title: '开发工具', description: '下载开发环境', url: '#', icon: 'icon-ide' },
    { title: '示例代码', description: '获取示例项目', url: '#', icon: 'icon-daima' },
    { title: '社区论坛', description: '技术交流讨论', url: '#', icon: 'icon-shequ' }
  ];
}
</script>

<style lang="less" scoped>
.microcontroller-detail {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;

  .detail-header {
    margin-bottom: 24px;
  }

  .detail-content {
    .detail-card {
      margin-bottom: 24px;

      .mcu-image-large {
        text-align: center;
        margin-bottom: 16px;

        img {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
        }
      }

      .scene-card {
        text-align: center;

        .scene-icon {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          font-size: 24px;
          color: #1890ff;
        }
      }
    }
  }

  .no-mcu-selected {
    text-align: center;
    padding: 100px 0;
  }
}
</style>
