<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Создание отчёта</h2>

      <div class="mb-3">
        <label class="block text-sm font-medium mb-1">Название</label>
        <input
          v-model="form.name"
          type="text"
          class="border rounded-lg w-full p-2"
        />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium mb-1">Заказчик</label>
        <select v-model="form.client" class="border rounded-lg w-full p-2">
          <option :value="null">— Внутренний отчёт —</option>
          <option
            v-for="client in clients"
            :key="client.id"
            :value="client.id"
          >
            {{ client.name }}
          </option>
        </select>
      </div>

      <div v-if="form.client" class="mb-3">
        <label class="block text-sm font-medium mb-1">Объект</label>
        <select v-model="form.filter.object" class="border rounded-lg w-full p-2">
          <option :value="null">— Все объекты —</option>
          <option
            v-for="obj in objects"
            :key="obj.id"
            :value="obj.id"
          >
            {{ obj.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium mb-1">Период</label>
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="allTime"
            id="allTime"
          />
          <label for="allTime" class="text-sm">За всё время</label>
        </div>

        <div v-if="!allTime" class="flex gap-2 mt-2">
          <input
            v-model="form.filter.period.from"
            type="date"
            class="border rounded-lg w-full p-2"
          />
          <input
            v-model="form.filter.period.to"
            type="date"
            class="border rounded-lg w-full p-2"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button
          @click="close"
          class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Отмена
        </button>
        <button
          @click="createReport"
          class="px-4 py-2 bg-medium text-light rounded-lg hover:bg-dark hover:text-light"
        >
          Создать
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted} from "vue";
import axios, { all } from "axios";

const emit = defineEmits(["close", "created"]);

const props = defineProps({
  token: String,
});

const form = ref({
  name: "",
  client: null,
  filter: {
    object: null,
    period: { from: null, to: null },
  },
});

const allTime = ref(false);
const clients = ref([]);
const objects = ref([]);

watch(allTime, (val) => {
  if (val) form.value.filter.period = null;
  else form.value.filter.period = { from: null, to: null };
});

watch(() => form.value.client, async (clientId) => {
  form.value.filter.object = null;
  objects.value = [];

  if (!clientId) return;
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(
      `http://localhost:3030/api/objects?client=${clientId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    objects.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки объектов:", error);
  }
});


const close = () => emit("close");


const fetchClients = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(
      "http://localhost:3030/api/users?role=client",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    clients.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки клиентов:", error);
  }
};

const createReport = async () => {
  if (!form.value.name.trim()) {
    alert("Введите название отчёта");
    return;
  }

  const token = localStorage.getItem('token')
  try {
    const response = await axios.post(
      "http://localhost:3030/api/reports",
      form.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    emit("created", response.data);
    close();
  } catch (error) {
    console.error("Ошибка при создании отчёта:", error);
    alert("Не удалось создать отчёт");
  }
};

onMounted(async () => {
    fetchClients()
})
</script>
