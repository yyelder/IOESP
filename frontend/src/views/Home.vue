<template>
  <div class="home-container">
    <!-- 关闭按钮 -->
    <div class="close-button" @click="closeWelcome">
      <span class="close-icon">×</span>
    </div>

    <div class="welcome-content">
      <h1>欢迎使用IOESP开发平台</h1>
      <p>请从上方导航栏选择功能模块，或点击CodeGen按钮开始单片机配置</p>
      <div class="feature-cards">
        <div class="feature-card">
          <icon-font type="icon-fengche" class="feature-icon" />
          <h3>框架</h3>
          <p>Socket通信、数据库、任务管理等框架功能</p>
        </div>
        <div class="feature-card">
          <icon-font type="icon-niudan" class="feature-icon" />
          <h3>系统</h3>
          <p>文件管理、窗口控制、通知等系统功能</p>
        </div>
        <div class="feature-card">
          <icon-font type="icon-liuxing" class="feature-icon" />
          <h3>特效</h3>
          <p>登录界面、动画效果等UI特效</p>
        </div>
        <div class="feature-card">
          <icon-font type="icon-gouwu" class="feature-icon" />
          <h3>跨平台</h3>
          <p>Go、Java、Python等跨平台开发</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import globalComponents from '@/components/global';

const { iconFont: IconFont } = globalComponents;

// 关闭欢迎界面
function closeWelcome() {
  // 触发自定义事件，通知父组件关闭欢迎界面
  window.dispatchEvent(new CustomEvent('closeWelcome'));
}
</script>

<style lang="less" scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.welcome-content {
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 40px;
}

.welcome-content h1 {
  font-size: 36px;
  margin-bottom: 16px;
  font-weight: 600;
}

.welcome-content > p {
  font-size: 18px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #fff;
}

.feature-card h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #fff;
  font-weight: 600;
}

.feature-card p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 10;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.close-icon {
  font-size: 24px;
  color: white;
  font-weight: bold;
  line-height: 1;
}
</style>
