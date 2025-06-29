<template>
  <div class="test-layout">
    <h2>布局测试页面</h2>
    <p>这个页面用于测试新的左右布局结构</p>

    <a-card title="布局信息">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="左侧区域">
          单片机信息面板（可拖拽调整宽度）
        </a-descriptions-item>
        <a-descriptions-item label="右侧区域">
          主导航 + 二级导航 + 内容区域
        </a-descriptions-item>
        <a-descriptions-item label="主导航">
          框架、系统、特效、cross
        </a-descriptions-item>
        <a-descriptions-item label="二级导航">
          根据主导航动态显示子菜单
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-divider />

    <a-alert
      message="布局测试"
      description="如果您能看到这个页面，说明新的左右布局结构工作正常。左侧应该显示单片机信息，右侧显示导航和内容。"
      type="success"
      show-icon
    />
  </div>
</template>

<script setup>
// 测试页面，无需特殊逻辑
</script>

<style lang="less" scoped>
.test-layout {
  padding: 20px;

  h2 {
    color: #1890ff;
    margin-bottom: 16px;
  }

  p {
    color: #666;
    margin-bottom: 24px;
  }
}
</style>
