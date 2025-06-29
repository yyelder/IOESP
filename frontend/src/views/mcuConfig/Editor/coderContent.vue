<template>
  <div class="coder-content">
    <div class="editor-header">
      <div class="file-info">
        <span class="file-name">{{ currentFile.name || '未选择文件' }}</span>
        <span v-if="isModified" class="modified-indicator">*</span>
      </div>
      <div class="editor-actions">
        <a-button
          size="small"
          @click="saveFile"
          :disabled="!currentFile.path || !isModified"
        >
          <template #icon>
            <icon-font type="icon-save" />
          </template>
          保存
        </a-button>
        <a-button
          size="small"
          @click="formatCode"
          :disabled="!currentFile.path"
        >
          <template #icon>
            <icon-font type="icon-format" />
          </template>
          格式化
        </a-button>
        <a-select
          v-model="selectedLanguage"
          size="small"
          style="width: 120px"
          @change="onLanguageChange"
        >
          <a-select-option value="auto">自动检测</a-select-option>
          <a-select-option value="c">C</a-select-option>
          <a-select-option value="cpp">C++</a-select-option>
          <a-select-option value="python">Python</a-select-option>
          <a-select-option value="javascript">JavaScript</a-select-option>
          <a-select-option value="java">Java</a-select-option>
        </a-select>
        <a-button
          size="small"
          @click="closeEditor"
          type="text"
          class="close-btn"
        >
          <template #icon>
            <icon-font type="icon-close" />
          </template>
          关闭
        </a-button>
        <a-button
          type="default"
          size="small"
          @click="testCodeEditor"
        >
          测试编辑器
        </a-button>
      </div>
    </div>

    <div class="editor-container">
      <div class="line-numbers">
        <div
          v-for="lineNum in lineCount"
          :key="lineNum"
          class="line-number"
        >
          {{ lineNum }}
        </div>
      </div>

      <div class="code-area">
        <!-- 可编辑的文本区域 -->
        <textarea
          ref="codeTextarea"
          v-model="codeContent"
          @input="onCodeChange"
          @keydown="onKeyDown"
          @scroll="onScroll"
          @click="onTextareaClick"
          class="code-textarea"
          placeholder="选择文件开始编辑..."
          spellcheck="false"
        ></textarea>
      </div>
    </div>

    <div class="editor-footer">
      <div class="status-info">
        <span>行: {{ cursorLine }}, 列: {{ cursorColumn }}</span>
        <span v-if="currentFile.path">文件: {{ currentFile.path }}</span>
      </div>
      <div class="language-info">
        <span>{{ getLanguageName() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import globalComponents from '@/components/global';

const { iconFont: IconFont } = globalComponents;

// 当前文件信息
const currentFile = ref({
  name: '',
  path: '',
  content: '',
  language: ''
});

// 代码内容
const codeContent = ref('');

// 是否已修改
const isModified = ref(false);

// 光标位置
const cursorLine = ref(1);
const cursorColumn = ref(1);

// 代码区域引用
const codeTextarea = ref(null);

// 选中的语言
const selectedLanguage = ref('auto');

// 行数
const lineCount = computed(() => {
  if (!codeContent.value) return 1;
  return codeContent.value.split('\n').length;
});

// 监听文件选择事件
onMounted(() => {
  // 监听文件选择事件
  window.addEventListener('fileSelected', handleFileSelected);

  // 检查是否有已保存的文件信息
  loadSavedFile();
});

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('fileSelected', handleFileSelected);
});

// 处理文件选择事件
function handleFileSelected(event) {
  const fileInfo = event.detail;
  loadFile(fileInfo);
}

// 加载保存的文件信息
function loadSavedFile() {
  const savedFile = localStorage.getItem('currentFile');
  if (savedFile) {
    try {
      const fileInfo = JSON.parse(savedFile);
      loadFile(fileInfo);
    } catch (error) {
      console.error('解析保存的文件信息失败:', error);
    }
  }
}

// 加载文件
function loadFile(fileInfo) {
  currentFile.value = {
    name: fileInfo.name,
    path: fileInfo.path,
    content: fileInfo.content,
    language: getLanguageFromFileName(fileInfo.name)
  };
  codeContent.value = fileInfo.content;
  selectedLanguage.value = 'auto';
  isModified.value = false;
  console.log('文件已加载:', fileInfo.name);
}

// 根据文件名获取语言类型
function getLanguageFromFileName(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const languageMap = {
    'c': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'h': 'c',
    'hpp': 'cpp',
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'java': 'java',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'xml': 'xml',
    'md': 'markdown',
    'txt': 'text'
  };

  return languageMap[ext] || 'text';
}

// 代码变化处理
function onCodeChange() {
  isModified.value = true;
  updateCursorPosition();
}

// 键盘事件处理
function onKeyDown(event) {
  // Tab键处理
  if (event.key === 'Tab') {
    event.preventDefault();
    const textarea = event.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newContent = codeContent.value.substring(0, start) + '    ' + codeContent.value.substring(end);
    codeContent.value = newContent;

    // 设置光标位置
    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 4;
    });
  }
}

// 滚动同步
function onScroll(event) {
  const lineNumbers = event.target.parentElement.previousElementSibling;
  const highlightLayer = event.target.parentElement.querySelector('.code-highlight');

  if (lineNumbers) {
    lineNumbers.scrollTop = event.target.scrollTop;
  }

  if (highlightLayer) {
    highlightLayer.scrollTop = event.target.scrollTop;
    highlightLayer.scrollLeft = event.target.scrollLeft;
  }
}

// 更新光标位置
function updateCursorPosition() {
  if (!codeTextarea.value) return;

  const textarea = codeTextarea.value;
  const text = textarea.value;
  const cursorPos = textarea.selectionStart;

  const lines = text.substring(0, cursorPos).split('\n');
  cursorLine.value = lines.length;
  cursorColumn.value = lines[lines.length - 1].length + 1;
}

// 保存文件
async function saveFile() {
  if (!currentFile.value.path || !isModified.value) return;

  try {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      await ipcRenderer.invoke('write-file', currentFile.value.path, codeContent.value);
      isModified.value = false;
      console.log('文件保存成功');
    } else {
      // 模拟保存
      console.log('模拟保存文件:', currentFile.value.path);
      isModified.value = false;
    }
  } catch (error) {
    console.error('保存文件失败:', error);
  }
}

// 格式化代码
function formatCode() {
  if (!currentFile.value.path) return;

  const language = selectedLanguage.value === 'auto' ? currentFile.value.language : selectedLanguage.value;

  switch (language) {
    case 'c':
    case 'cpp':
      codeContent.value = formatCCode(codeContent.value);
      break;
    case 'python':
      codeContent.value = formatPythonCode(codeContent.value);
      break;
    case 'javascript':
      codeContent.value = formatJavaScriptCode(codeContent.value);
      break;
    case 'java':
      codeContent.value = formatJavaCode(codeContent.value);
      break;
    default:
      codeContent.value = formatDefaultCode(codeContent.value);
  }

  isModified.value = true;
}

// C/C++ 代码格式化
function formatCCode(code) {
  const lines = code.split('\n');
  let indentLevel = 0;
  let inString = false;
  let inComment = false;
  let inBlockComment = false;
  const formattedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // 跳过空行
    if (!line) {
      formattedLines.push('');
      continue;
    }

    // 处理块注释
    if (line.includes('/*')) {
      inBlockComment = true;
    }
    if (line.includes('*/')) {
      inBlockComment = false;
    }

    if (inBlockComment) {
      formattedLines.push('    '.repeat(indentLevel) + line);
      continue;
    }

    // 处理行注释
    if (line.startsWith('//')) {
      formattedLines.push('    '.repeat(indentLevel) + line);
      continue;
    }

    // 处理预处理指令
    if (line.startsWith('#')) {
      formattedLines.push(line);
      continue;
    }

    // 减少缩进的情况
    if (line.startsWith('}') || line.startsWith('} else') || line.startsWith('} else if')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // 格式化当前行
    const formatted = '    '.repeat(indentLevel) + line;
    formattedLines.push(formatted);

    // 增加缩进的情况
    if (line.endsWith('{') ||
        line.startsWith('if ') ||
        line.startsWith('for ') ||
        line.startsWith('while ') ||
        line.startsWith('do ') ||
        line.startsWith('switch ') ||
        line.startsWith('case ') ||
        line.startsWith('default:') ||
        line.startsWith('else') ||
        line.startsWith('try ') ||
        line.startsWith('catch ') ||
        line.startsWith('finally ')) {
      indentLevel++;
    }

    // 特殊处理：else if 和 else
    if (line.startsWith('else if') || line.startsWith('else')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }

  return formattedLines.join('\n');
}

// Python 代码格式化
function formatPythonCode(code) {
  const lines = code.split('\n');
  let indentLevel = 0;
  const formattedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // 跳过空行
    if (!line) {
      formattedLines.push('');
      continue;
    }

    // 处理注释
    if (line.startsWith('#')) {
      formattedLines.push('    '.repeat(indentLevel) + line);
      continue;
    }

    // 减少缩进的情况
    if (line.startsWith('elif ') || line.startsWith('else:') || line.startsWith('except ') || line.startsWith('finally:')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // 格式化当前行
    const formatted = '    '.repeat(indentLevel) + line;
    formattedLines.push(formatted);

    // 增加缩进的情况
    if (line.endsWith(':') &&
        !line.startsWith('#') &&
        !line.startsWith('elif ') &&
        !line.startsWith('else:') &&
        !line.startsWith('except ') &&
        !line.startsWith('finally:')) {
      indentLevel++;
    }
  }

  return formattedLines.join('\n');
}

// JavaScript 代码格式化
function formatJavaScriptCode(code) {
  const lines = code.split('\n');
  let indentLevel = 0;
  const formattedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // 跳过空行
    if (!line) {
      formattedLines.push('');
      continue;
    }

    // 处理注释
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*/')) {
      formattedLines.push('    '.repeat(indentLevel) + line);
      continue;
    }

    // 减少缩进的情况
    if (line.startsWith('}') || line.startsWith('} else') || line.startsWith('} else if')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // 格式化当前行
    const formatted = '    '.repeat(indentLevel) + line;
    formattedLines.push(formatted);

    // 增加缩进的情况
    if (line.endsWith('{') ||
        line.startsWith('if ') ||
        line.startsWith('for ') ||
        line.startsWith('while ') ||
        line.startsWith('do ') ||
        line.startsWith('switch ') ||
        line.startsWith('case ') ||
        line.startsWith('default:') ||
        line.startsWith('else') ||
        line.startsWith('try ') ||
        line.startsWith('catch ') ||
        line.startsWith('finally ') ||
        line.startsWith('function ')) {
      indentLevel++;
    }

    // 特殊处理：else if 和 else
    if (line.startsWith('else if') || line.startsWith('else')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }

  return formattedLines.join('\n');
}

// Java 代码格式化
function formatJavaCode(code) {
  const lines = code.split('\n');
  let indentLevel = 0;
  const formattedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // 跳过空行
    if (!line) {
      formattedLines.push('');
      continue;
    }

    // 处理注释
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*/')) {
      formattedLines.push('    '.repeat(indentLevel) + line);
      continue;
    }

    // 减少缩进的情况
    if (line.startsWith('}') || line.startsWith('} else') || line.startsWith('} else if')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // 格式化当前行
    const formatted = '    '.repeat(indentLevel) + line;
    formattedLines.push(formatted);

    // 增加缩进的情况
    if (line.endsWith('{') ||
        line.startsWith('if ') ||
        line.startsWith('for ') ||
        line.startsWith('while ') ||
        line.startsWith('do ') ||
        line.startsWith('switch ') ||
        line.startsWith('case ') ||
        line.startsWith('default:') ||
        line.startsWith('else') ||
        line.startsWith('try ') ||
        line.startsWith('catch ') ||
        line.startsWith('finally ') ||
        line.startsWith('public ') ||
        line.startsWith('private ') ||
        line.startsWith('protected ')) {
      indentLevel++;
    }

    // 特殊处理：else if 和 else
    if (line.startsWith('else if') || line.startsWith('else')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }

  return formattedLines.join('\n');
}

// 默认代码格式化
function formatDefaultCode(code) {
  const lines = code.split('\n');
  let indentLevel = 0;
  const formattedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line) {
      formattedLines.push('');
      continue;
    }

    // 减少缩进的情况
    if (line.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const formatted = '    '.repeat(indentLevel) + line;
    formattedLines.push(formatted);

    // 增加缩进的情况
    if (line.endsWith('{')) {
      indentLevel++;
    }
  }

  return formattedLines.join('\n');
}

// 获取语言名称
function getLanguageName() {
  const languageMap = {
    'c': 'C',
    'cpp': 'C++',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'html': 'HTML',
    'css': 'CSS',
    'json': 'JSON',
    'xml': 'XML',
    'markdown': 'Markdown',
    'text': 'Text'
  };

  return languageMap[currentFile.value.language] || 'Text';
}

// 暴露方法给父组件
defineExpose({
  loadFile,
  saveFile,
  currentFile: computed(() => currentFile.value),
  isModified: computed(() => isModified.value)
});

// 监听文件变化
watch(codeContent, () => {
  if (currentFile.value.path) {
    isModified.value = true;
  }
});

// 监听语言变化
watch(selectedLanguage, () => {
});

// 关闭编辑器
function closeEditor() {
  // 清除当前文件信息
  currentFile.value = {
    name: '',
    path: '',
    content: '',
    language: ''
  };

  codeContent.value = '';
  isModified.value = false;

  // 清除localStorage中的文件信息
  localStorage.removeItem('currentFile');

  // 触发关闭编辑器事件
  window.dispatchEvent(new CustomEvent('editorClosed'));

  console.log('编辑器已关闭，返回欢迎界面');
}

// 语言变化处理
function onLanguageChange(value) {
  selectedLanguage.value = value;
  isModified.value = true;
}

// 文本区域点击处理
function onTextareaClick() {
  updateCursorPosition();
}

// 测试编辑器
function testCodeEditor() {
  console.log('测试编辑器');
}
</script>

<style lang="less" scoped>
.coder-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #2d2d30;
  border-bottom: 1px solid #3e3e42;

  .file-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .file-name {
      font-weight: 500;
      color: #cccccc;
    }

    .modified-indicator {
      color: #ff6b6b;
      font-weight: bold;
    }
  }

  .editor-actions {
    display: flex;
    gap: 8px;

    .close-btn {
      color: #ff6b6b;

      &:hover {
        color: #ff5252;
        background: rgba(255, 107, 107, 0.1);
      }
    }
  }
}

.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.line-numbers {
  width: 60px;
  background: #252526;
  border-right: 1px solid #3e3e42;
  overflow-y: auto;
  padding: 8px 0;

  .line-number {
    height: 18px;
    line-height: 18px;
    text-align: right;
    padding-right: 8px;
    color: #858585;
    font-size: 12px;
    user-select: none;
  }
}

.code-area {
  position: relative;
  flex: 1;
  display: flex;
  overflow: hidden;
}

.code-textarea {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 18px;
  padding: 8px;
  margin: 0;
  border: none;
  outline: none;
  resize: none;
  tab-size: 4;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: auto;
  z-index: 1;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  background: #007acc;
  color: white;
  font-size: 12px;

  .status-info {
    display: flex;
    gap: 16px;
  }

  .language-info {
    font-weight: 500;
  }
}

:deep(.ant-btn) {
  background: #3c3c3c;
  border-color: #5a5a5a;
  color: #d4d4d4;

  &:hover {
    background: #4c4c4c;
    border-color: #6a6a6a;
    color: #ffffff;
  }

  &:disabled {
    background: #2d2d30;
    border-color: #3e3e42;
    color: #858585;
  }
}
</style>
