<template>
  <div class="microcontroller-select">
    <div class="select-header">
      <h1>选择单片机型号</h1>
      <p>请选择您要使用的单片机型号</p>
    </div>

    <div class="select-content">
      <a-row :gutter="[24, 24]">
        <a-col :span="8" v-for="(mcu, index) in microcontrollerList" :key="index">
          <a-card
            class="mcu-card"
            :class="{ 'selected': selectedMcu?.id === mcu.id }"
            hoverable
            @click="selectMicrocontroller(mcu)"
          >
            <template #cover>
              <div class="mcu-image">
                <img :src="mcu.image" :alt="mcu.name" />
              </div>
            </template>
            <a-card-meta :title="mcu.name" :description="mcu.description">
              <template #avatar>
                <a-avatar :src="mcu.icon" />
              </template>
            </a-card-meta>
            <div class="mcu-specs">
              <a-tag color="blue">{{ mcu.architecture }}</a-tag>
              <a-tag color="green">{{ mcu.frequency }}</a-tag>
              <a-tag color="orange">{{ mcu.flash }}</a-tag>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div class="select-footer">
      <a-button
        type="primary"
        size="large"
        :disabled="!selectedMcu"
        @click="confirmSelection"
      >
        确认选择
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedMcu = ref(null);

const microcontrollerList = ref([
  {
    id: 'stm32f103',
    name: 'STM32F103C8T6',
    description: 'ARM Cortex-M3内核，72MHz主频，64KB Flash',
    architecture: 'ARM Cortex-M3',
    frequency: '72MHz',
    flash: '64KB',
    image: 'https://via.placeholder.com/200x150/4A90E2/FFFFFF?text=STM32F103',
    icon: 'https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=STM'
  },
  {
    id: 'stm32f407',
    name: 'STM32F407VGT6',
    description: 'ARM Cortex-M4内核，168MHz主频，1MB Flash',
    architecture: 'ARM Cortex-M4',
    frequency: '168MHz',
    flash: '1MB',
    image: 'https://via.placeholder.com/200x150/4A90E2/FFFFFF?text=STM32F407',
    icon: 'https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=STM'
  },
  {
    id: 'esp32',
    name: 'ESP32-WROOM-32',
    description: '双核Tensilica LX6，240MHz主频，4MB Flash',
    architecture: 'Tensilica LX6',
    frequency: '240MHz',
    flash: '4MB',
    image: 'https://via.placeholder.com/200x150/FF6B35/FFFFFF?text=ESP32',
    icon: 'https://via.placeholder.com/32x32/FF6B35/FFFFFF?text=ESP'
  },
  {
    id: 'arduino-uno',
    name: 'Arduino UNO R3',
    description: 'ATmega328P，16MHz主频，32KB Flash',
    architecture: 'AVR',
    frequency: '16MHz',
    flash: '32KB',
    image: 'https://via.placeholder.com/200x150/00979D/FFFFFF?text=Arduino',
    icon: 'https://via.placeholder.com/32x32/00979D/FFFFFF?text=AR'
  },
  {
    id: 'raspberry-pi-pico',
    name: 'Raspberry Pi Pico',
    description: 'RP2040双核ARM Cortex-M0+，133MHz主频，2MB Flash',
    architecture: 'ARM Cortex-M0+',
    frequency: '133MHz',
    flash: '2MB',
    image: 'https://via.placeholder.com/200x150/C51D4A/FFFFFF?text=RPi+Pico',
    icon: 'https://via.placeholder.com/32x32/C51D4A/FFFFFF?text=RP'
  },
  {
    id: 'nrf52840',
    name: 'nRF52840',
    description: 'ARM Cortex-M4内核，64MHz主频，1MB Flash',
    architecture: 'ARM Cortex-M4',
    frequency: '64MHz',
    flash: '1MB',
    image: 'https://via.placeholder.com/200x150/00D4AA/FFFFFF?text=nRF52840',
    icon: 'https://via.placeholder.com/32x32/00D4AA/FFFFFF?text=nR'
  }
]);

function selectMicrocontroller(mcu) {
  selectedMcu.value = mcu;
}

function confirmSelection() {
  if (selectedMcu.value) {
    // 将选中的单片机信息存储到localStorage
    localStorage.setItem('selectedMicrocontroller', JSON.stringify(selectedMcu.value));
    // 跳转到主页面
    router.push('/');
  }
}
</script>

<style lang="less" scoped>
.microcontroller-select {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;

  .select-header {
    text-align: center;
    margin-bottom: 40px;
    color: white;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 600;
    }

    p {
      font-size: 1.1rem;
      opacity: 0.9;
    }
  }

  .select-content {
    max-width: 1200px;
    margin: 0 auto;

    .mcu-card {
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      &.selected {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }

      .mcu-image {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;

        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      }

      .mcu-specs {
        margin-top: 12px;

        .ant-tag {
          margin-right: 8px;
          margin-bottom: 4px;
        }
      }
    }
  }

  .select-footer {
    text-align: center;
    margin-top: 40px;

    .ant-btn {
      height: 48px;
      padding: 0 32px;
      font-size: 16px;
    }
  }
}
</style>
