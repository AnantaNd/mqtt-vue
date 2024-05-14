<template>
  <div>
    <a-button type="primary" @click="showModal">new subcribtions</a-button>
    <a-modal v-model:open="open" title="New Subcription" @ok="handleOk" :footer="null">
      <a-form :model="form" type="submit" class="pt-8">
        <a-form-item name="topic" label="topic" :rules="rules.topic">
          <a-input placeholder="topic" size="large" v-model:value="form.topic" />
        </a-form-item>
        <a-form-item name="qos" label="qos" :rules="rules.qos">
          <a-input placeholder="qos" size="large" v-model:value="form.qos" />
        </a-form-item>
        <a-form-item class="pt-3 flex justify-end">
          <a-button html-type="submit" type="primary"> subcribe </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data: () => ({
    open: false,
    form: {
      topic: '',
      qos: null
    },
    rules: {
      topic: [{ required: true, message: 'Please input topic' }],
      qos: [{ required: true, message: 'Please input qos' }]
    }
  }),
  methods: {
    showModal() {
      this.open = true
    },
    handleOk() {
      this.open = false
    }
  }
}
</script>
