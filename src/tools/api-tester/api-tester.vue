<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useValidation } from '@/composable/validation';

const method = ref<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
const url = ref('');
const params = ref([{ key: '', value: '' }]);
const body = ref('');
const response = ref('');

const urlValidation = useValidation({
  source: url,
  rules: [
    {
      message: 'URL is invalid',
      validator: value => /^https?:\/\/\S+$/.test(value),
    },
  ],
});

function addParam() {
  params.value.push({ key: '', value: '' });
}

function removeParam(index: number) {
  params.value.splice(index, 1);
}

async function sendRequest() {
  if (!urlValidation.isValid) {
    return;
  }

  const paramObject: Record<string, string> = {};
  params.value.forEach(({ key, value }) => {
    if (key) {
      paramObject[key] = value;
    }
  });

  try {
    const res = await axios({
      method: method.value,
      url: url.value,
      params: ['GET', 'DELETE'].includes(method.value) ? paramObject : {},
      data: ['POST', 'PUT', 'PATCH'].includes(method.value) ? parseBody(body.value) : {},
    });
    response.value = JSON.stringify(res.data, null, 2);
  }
  catch (err: any) {
    response.value = err.response ? JSON.stringify(err.response.data, null, 2) : err.message;
  }
}

function parseBody(json: string) {
  try {
    return JSON.parse(json);
  }
  catch {
    return {};
  }
}
</script>

<template>
  <c-card title="API Tester">
    <!-- Method & URL -->
    <n-grid cols="3" x-gap="12" mb-2>
      <n-gi span="1">
        <n-select
          v-model:value="method"
          :options="[
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'PATCH', value: 'PATCH' },
            { label: 'DELETE', value: 'DELETE' },
          ]"
        />
      </n-gi>
      <n-gi span="2">
        <c-input-text v-model:value="url" :validation="urlValidation" placeholder="https://example.com/api" />
      </n-gi>
    </n-grid>

    <!-- Params -->
    <div mb-2>
      <h4>Parameters</h4>
      <n-grid v-for="(param, idx) in params" :key="idx" :cols="3" x-gap="8" mb-1>
        <n-gi span="1">
          <c-input-text v-model:value="param.key" placeholder="Key" />
        </n-gi>
        <n-gi span="1">
          <c-input-text v-model:value="param.value" placeholder="Value" />
        </n-gi>
        <n-gi span="1">
          <c-button type="error" @click="removeParam(idx)">
            Remove
          </c-button>
        </n-gi>
      </n-grid>
      <c-button @click="addParam">
        + Thêm Param
      </c-button>
    </div>

    <!-- Request Body (for POST, PUT, PATCH) -->
    <div v-if="['POST', 'PUT', 'PATCH'].includes(method)" mb-2>
      <c-input-text v-model:value="body" placeholder="JSON Body" multiline rows="5" />
    </div>

    <!-- Send Button -->
    <div mt-4 flex justify-center>
      <c-button :disabled="!urlValidation.isValid || !url" @click="sendRequest">
        Gửi
      </c-button>
    </div>
  </c-card>

  <!-- Response -->
  <c-card title="Phản hồi">
    <pre>{{ response }}</pre>
  </c-card>
</template>
