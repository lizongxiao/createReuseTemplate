<script setup lang="ts">
import { createReuseTemplate } from './utils/createReuseTemplate'

const [DefineTemplate, UseTemplate] = createReuseTemplate<{
  msg: string
}, 'click'>()

const handleClick = (index: number) => {
  console.log('点击事件 ✅：', index)
}
</script>

<template>
  <div style="padding: 20px">
    <DefineTemplate name="item1" v-slot="{ msg, listeners }">
      <button v-on="listeners" style="margin: 8px">
        🎉 模板 1：{{ msg }}
      </button>
    </DefineTemplate>

    <DefineTemplate name="item2" v-slot="{ msg, listeners }">
      <div v-on="listeners" style="margin: 8px; cursor: pointer; background: #eef; padding: 6px">
        🌟 模板 2：{{ msg }}
      </div>
    </DefineTemplate>

    <UseTemplate name="item1" msg="Hello1" @click="() => handleClick(1)" />
    <UseTemplate name="item2" msg="Hello2" @click="() => handleClick(2)" />
  </div>
</template>
