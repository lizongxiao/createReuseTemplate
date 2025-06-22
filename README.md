# 🧩 createReuseTemplate：Vue 3 复用模板工具

一个用于 Vue 3 的轻量级 **插槽模板复用** 工具，适合用于复杂场景下**动态复用模板渲染逻辑**，如低代码引擎、表单配置器、可插拔 UI 组件系统等。

---

## ✨ 特性

- ✅ 支持动态模板注册与复用
- ✅ 支持 Props 参数传入模板
- ✅ 支持事件传递（如 @click）
- ✅ 使用类型安全的泛型构建上下文
- ✅ 兼容 v-slot 写法
- ✅ 自动透传所有 attrs、onXxx 事件

---

## 📦 安装

将 `createReuseTemplate.ts` 放入你的项目 `utils/` 目录中使用，无需额外依赖。

---

## 🔧 使用方式

### 1️⃣ 引入工具并创建模板组件

```ts
import { createReuseTemplate } from './utils/createReuseTemplate'

const [DefineTemplate, UseTemplate] = createReuseTemplate<{
  msg: string
}, 'click'>()
```

- 第一个泛型：传入模板支持的 props 类型
- 第二个泛型（可选）：支持的事件名称（如 `'click'`）

---

### 2️⃣ 定义模板

```vue
<DefineTemplate name="item1" v-slot="{ msg, listeners }">
  <button v-on="listeners">🎉 模板 1：{{ msg }}</button>
</DefineTemplate>

<DefineTemplate name="item2" v-slot="{ msg, listeners }">
  <div v-on="listeners">🌟 模板 2：{{ msg }}</div>
</DefineTemplate>
```

- `name` 为模板名称
- `v-slot` 中自动提供：
  - 所有传入的 props（如 msg）
  - 所有绑定事件集合 listeners（通过 `v-on="listeners"` 绑定）

---

### 3️⃣ 使用模板

```vue
<UseTemplate name="item1" msg="Hello1" @click="() => handleClick(1)" />
<UseTemplate name="item2" msg="Hello2" @click="() => handleClick(2)" />
```

---

## 🔍 参数说明

| 参数       | 说明                         |
|------------|------------------------------|
| `name`     | 模板名称，对应注册时定义     |
| 其他 props | 自动透传到模板中             |
| `@事件名`  | 会被收集并传入 `listeners`    |

---

## 🧠 示例上下文结构

```ts
type TemplateContext = {
  msg: string
  listeners: {
    click?: () => void
    input?: (val: any) => void
    ...
  }
}
```

---

## 🧪 效果预览

```vue
<DefineTemplate name="item1" v-slot="{ msg, listeners }">
  <button v-on="listeners">点击：{{ msg }}</button>
</DefineTemplate>

<UseTemplate name="item1" msg="你好模板" @click="handleClick" />
```

点击按钮会触发 `handleClick` 事件，传递的 `msg` 可渲染在模板中。

---

## 🛠 高级用法建议

- 配合动态数据驱动模板名称 `:name="currentType"`
- 结合 `defineAsyncComponent` 实现懒加载模板
- 可扩展支持 `slots`、`scopedSlots` 泛型定义
- 与低代码平台结合实现插槽注入器

---

## 📁 文件结构建议

```
src/
├─ utils/
│  └─ createReuseTemplate.ts
├─ components/
│  └─ ReusableTemplate.vue
```

---

## 📜 License

MIT License
