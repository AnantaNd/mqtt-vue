<template>
  <main class="flex flex-col gap-5">
    <section class="bg-white w-full rounded-md">
      <a-form class="p-8 flex flex-col gap-3">
        <h1 class="font-semibold capitalize">config</h1>
        <div class="flex flex-row gap-3 flex-wrap">
          <a-button type="primary" @click="createConnection">connect</a-button>
          <a-button danger @click="destroyDisconnect">disconnect</a-button>
        </div>
        <hr />
        <h1 class="font-semibold capitalize">subcribe</h1>
        <a-form-item>
          <label>topic</label>
          <a-input v-model:value="subcription.topic" />
        </a-form-item>
        <a-form-item>
          <label>qos</label>
          <a-input v-model:value="subcription.qos" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="doSubcribe">subcribe</a-button>
        </a-form-item>
      </a-form>
    </section>
    <section>
      <div class="min-h-72 bg-white rounded-md overflow-y-auto p-8">
        <div
          v-if="reciveMsg"
          class="bg-green-300 w-[100px] rounded-t-lg rounded-bl-none rounded-br-lg p-4 shadow-md"
        >
          <h1>{{ reciveMsg }}</h1>
          <h1>{{ timereciveMsg }}</h1>
        </div>
      </div>
    </section>
    <section class="bg-white w-full rounded-md">
      <a-form class="p-8 flex flex-col gap-3">
        <h1 class="font-semibold capitalize">publish</h1>
        <a-form-item>
          <label>message</label>
          <a-input v-model:value="publish.payload" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="doPublish">publish</a-button>
        </a-form-item>
      </a-form>
    </section>
  </main>
</template>

<script>
import mqtt from 'mqtt'

export default {
  data: () => ({
    // mosquitto_sub -h 10.32.50.93 -u fiberzone -P dmFybmlvbi1tcXR0 -t test/data
    // mosquitto_pub -h 10.32.50.93 -u fiberzone -P dmFybmlvbi1tcXR0 -t test/data -m "test data"
    connection: {
      protocol: 'wss',
      // host: 'broker.emqx.io',
      host: 'broker.megalos.varnion.com',
      port: 443,
      clientId: 'emqx_vue3_' + Math.random().toString(16).substring(2, 8),
      username: 'fiberzone',
      password: 'dmFybmlvbi1tcXR0',
      clean: true,
      connectTimeout: 30 * 1000, // ms
      reconnectPeriod: 4000 // ms
    },
    subcription: {
      topic: 'test/data',
      qos: 0
    },
    publish: {
      topic: 'test/data',
      qos: 0,
      payload: 'helo'
    },
    client: {
      connected: false
    },
    receiveNews: '',
    reciveMsg: null,
    timereciveMsg: null,
    subscribeSuccess: false,
    connecting: false,
    retryTimes: 0
  }),
  methods: {
    initData() {
      this.client = {
        connected: false
      }
      this.retryTimes = 0
      this.connecting = false
      this.subscribeSuccess = false
    },
    handleOnReconnect() {
      this.retryTimes += 1
      if (this.retryTimes > 5) {
        try {
          this.client.end()
          this.initData()
          this.$message.error('Connection max limit, stop retry')
        } catch (error) {
          this.$message.error(error.toString())
        }
      }
    },
    createConnection() {
      try {
        this.connecting = true
        const { protocol, host, port, ...options } = this.connection
        const connUrl = `${protocol}://${host}:${port}`
        this.client = mqtt.connect(connUrl, options)
        if (this.client.on) {
          this.connecting = false
          console.log('connection success')
        }
        this.client.on('reconnect', this.handleOnReconnect)
        this.client.on('error', (err) => {
          console.log('connection faild', err)
        })
        this.client.on('msg', (topic, msg) => {
          this.receiveNews = this.receiveNews.concat(msg)
          console.log(`recived msg ${msg} form topic ${topic}`)
        })
      } catch (err) {
        this.connecting = false
        console.log('mqtt connect error', err)
      }
    },
    doSubcribe() {
      const { topic, qos } = this.subcription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('subcribe to topics error', error)
          return
        }
        this.subscribeSuccess = true
        console.log('subcribe to topic res', res)
      })
    },
    doUnSubcribe() {
      const { topic } = this.subcription
      this.client.unsubcribe(topic, (error) => {
        if (error) {
          console.log('unsubcribe error', error)
        }
      })
    },
    doPublish() {
      const { topic, qos, payload } = this.publish
      this.client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log('publish error', error)
        }
        console.log(payload)
        this.reciveMsg = payload
        this.timereciveMsg = Date()
      })
    },
    destroyDisconnect() {
      if (this.client.connected) {
        try {
          this.client.end(false, () => {
            this.initData()
            console.log('success disconnect')
          })
        } catch (err) {
          console.log('disconnect fail', err)
        }
      }
    }
  }
}
</script>
