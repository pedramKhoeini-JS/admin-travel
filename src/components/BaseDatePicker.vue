<template>
  <q-input
    outlined
    dense
    v-model="date"
    @click="$refs.qDateProxy.show()"
    :label="label"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
          ref="qDateProxy"
        >
          <q-date
            v-model="date"
            color="warning"
            text-color="black"
            dark
            @update:model-value="setDate"
            square
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Close"
                color="white"
                text-color="black"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
export default {
  name: "BaseDatePicker",
  props: {
    dateProp: String,
    label: String,
  },
  data() {
    return {
      date: this.dateProp,
    };
  },
  watch: {
    date() {
      this.$emit("update", this.date);
    },
  },
  methods: {
    setDate(value) {
      this.date = value;
      this.$refs.qDateProxy.hide();
    },
  },
};
</script>
<style>
</style>
