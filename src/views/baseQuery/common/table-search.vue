<template>
  <div class="search-container">
    <el-form ref="searchRef" :model="query" :inline="true">
      <el-form-item v-for="item in options" :label="item.label" :prop="item.prop">
        <!-- 文本框、下拉框、日期框 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="query[item.prop]"
          :disabled="item.disabled"
          :placeholder="item.placeholder"
          clearable
        ></el-input>
        <el-select
          v-else-if="item.type === 'select'"
          v-model="query[item.prop]"
          :disabled="item.disabled"
          :clearable="false"
          :placeholder="item.placeholder"
        >
          <el-option v-for="opt in item.opts" :label="opt.label" :value="opt.value"></el-option>
        </el-select>
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="query[item.prop]"
          type="date"
          :clearable="false"
          :editable="false"
          :placeholder="item.placeholder"
          :value-format="item.format"
          :format="item.format"
        ></el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'daterange'"
          v-model="query[item.prop]"
          type="daterange"
          :clearable="false"
          :editable="false"
          range-separator="至"
          :placeholder="item.placeholder"
          :value-format="item.format"
          :format="item.format"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
        <el-button type="warning" style="margin-left: 20px" :icon="Refresh" @click="resetForm(searchRef)">重置</el-button>
      </el-form-item>
      <el-form-item>
        <div class="table-tooltip">
          <el-tooltip effect="dark" content="列设置" placement="top">
            <el-dropdown :hide-on-click="false" size="small" trigger="click">
              <svg-icon style="width: 40px; height: 40px; margin-right: 10px" icon-class="setting"></svg-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="c in columns">
                    <el-checkbox v-model="c.visible" :label="c.label" />
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { FormInstance } from 'element-plus'
  import { Search, Refresh } from '@element-plus/icons-vue'
  import { PropType, ref, toRefs } from 'vue'
  import { FormOptionList } from '@/types/form-option'

  const props = defineProps({
    query: {
      type: Object,
      required: true,
    },
    options: {
      type: Array as PropType<Array<FormOptionList>>,
      required: true,
    },
    search: {
      type: Function,
      default: () => {},
    },
    columns: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    reset: {
      type: Function,
      default: () => {},
    },
  })
  const { query, options, search, columns } = toRefs(props)

  const searchRef = ref<FormInstance>()
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    //props.search();
    props.reset()
  }
</script>

<style scoped>
  .search-container {
    padding: 20px 30px 0;
    background-color: #fff;
    margin: 30px 30px 10px 30px;
    border: 1px solid #ddd;
    border-radius: 10px;
  }
  .table-tooltip:hover {
    cursor: cell;
  }
</style>
