<template>
  <div class="mcu-choose-container">
    <h2>选择单片机型号</h2>
    <div class="mcu-list">
      <div
        v-for="mcu in mcuList"
        :key="mcu.name"
        class="mcu-item"
        :class="{ selected: selectedMcu === mcu.name }"
        @click="selectMcu(mcu.name)"
      >
        <div class="mcu-title">{{ mcu.name }}</div>
        <div class="mcu-desc">{{ mcu.desc }}</div>
      </div>
    </div>
    <a-button type="primary" :disabled="!selectedMcu" @click="goToConfig">进入主页面</a-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const mcuList = [
  {
    name: 'STM32F103C8T6',
    desc: '主流Cortex-M3内核，64KB Flash，20KB RAM',
    image: '/images/mcu/stm32f103c8t6.png',
    description: '基于ARM Cortex-M3内核的32位微控制器，具有丰富的外设接口和强大的处理能力。',
    architecture: 'ARM Cortex-M3',
    frequency: '72MHz',
    flash: '64KB'
  },
  {
    name: 'STM32F407VET6',
    desc: '高性能Cortex-M4内核，512KB Flash，192KB RAM',
    image: '/images/mcu/stm32f407vet6.png',
    description: '高性能ARM Cortex-M4内核微控制器，支持DSP指令集和浮点运算单元。',
    architecture: 'ARM Cortex-M4',
    frequency: '168MHz',
    flash: '512KB'
  },
  {
    name: 'GD32F103CBT6',
    desc: '国产兼容型号，128KB Flash，32KB RAM',
    image: '/images/mcu/gd32f103cbt6.png',
    description: '国产ARM Cortex-M3内核微控制器，与STM32F103系列兼容，性价比高。',
    architecture: 'ARM Cortex-M3',
    frequency: '108MHz',
    flash: '128KB'
  },
  {
    name: 'ESP32',
    desc: '双核Xtensa，WiFi/BT，448KB ROM，520KB SRAM',
    image: '/images/mcu/esp32.png',
    description: '双核Xtensa LX6处理器，集成WiFi和蓝牙功能，适合物联网应用。',
    architecture: 'Xtensa LX6',
    frequency: '240MHz',
    flash: '4MB'
  }
];

const selectedMcu = ref('');

function selectMcu(name) {
  selectedMcu.value = name;
}

function goToConfig() {
  if (selectedMcu.value) {
    // 根据选中的单片机名称获取对应的信息
    const selectedMcuInfo = mcuList.find(mcu => mcu.name === selectedMcu.value);

    if (selectedMcuInfo) {
      // 保存选中的单片机信息到localStorage
      const mcuData = {
        name: selectedMcuInfo.name,
        image: selectedMcuInfo.image,
        description: selectedMcuInfo.description,
        architecture: selectedMcuInfo.architecture,
        frequency: selectedMcuInfo.frequency,
        flash: selectedMcuInfo.flash
      };
      localStorage.setItem('selectedMicrocontroller', JSON.stringify(mcuData));
    }

    // 跳转到主页面
    router.push('/');
  }
}
</script>

<style scoped>
.mcu-choose-container {
  max-width: 500px;
  margin: 60px auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
  padding: 32px 24px;
  text-align: center;
}
.mcu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 32px 0 24px 0;
  justify-content: center;
}
.mcu-item {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 18px 28px;
  cursor: pointer;
  min-width: 160px;
  background: #fafbfc;
  transition: all 0.2s;
}
.mcu-item.selected, .mcu-item:hover {
  border-color: #1890ff;
  background: #e6f7ff;
}
.mcu-title {
  font-weight: bold;
  font-size: 18px;
  color: #1890ff;
}
.mcu-desc {
  font-size: 13px;
  color: #888;
  margin-top: 6px;
}
</style>
