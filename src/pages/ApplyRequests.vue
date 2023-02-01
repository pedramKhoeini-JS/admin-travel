<template>
  <q-page>
    <div class="row q-pa-sm">
      <div class="col-12">
        <q-card class="my-card q-mb-xs" bordered>
          <q-card-section class="no-padding">
            <div class="row">
              <div class="col-md-3 col-12 q-pa-sm">
                <base-date-picker
                  :dateProp="fromDate"
                  @update="(val) => (fromDate = val)"
                  :label="'Begain'"
                ></base-date-picker>
              </div>
              <div class="col-md-3 col-12 q-pa-sm">
                <base-date-picker
                  :dateProp="toDate"
                  @update="(val) => (toDate = val)"
                  :label="'End'"
                ></base-date-picker>
              </div>
              <div class="col-md-3 col-12 q-pa-sm">
                <q-field dense outlined>
                  <template v-slot:control>
                    <div class="row justify-center full-width no-outline" tabindex="0">
                      <q-radio
                        v-model="isChecked"
                        checked-icon="task_alt"
                        :val="null"
                        label="All"
                        dense
                        class="q-px-sm"
                      />
                      <q-radio
                        v-model="isChecked"
                        checked-icon="task_alt"
                        :val="true"
                        label="Checked"
                        dense
                        class="q-px-sm"
                      />
                      <q-radio
                        v-model="isChecked"
                        checked-icon="task_alt"
                        :val="false"
                        label="Not checked"
                        dense
                        class="q-px-sm"
                      />
                    </div>
                  </template>
                </q-field>
              </div>
              <div class="q-pa-sm">
                <q-btn
                  style="height: 100%"
                  label="Filter"
                  no-caps
                  icon="filter_alt"
                  unelevated
                  @click="filterRequests"
                  color="warning"
                  class="text-black"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="my-card" bordered>
          <q-card-section class="no-padding">
            <div class="row">
              <div class="col-12">
                <q-table
                  class="user-message-table"
                  title="Requests"
                  :rows="applyList"
                  :columns="columns"
                  hide-pagination
                  :rows-per-page-options="[0]"
                  separator="horizontal"
                  :loading="loadingTable"
                  dense
                >
                  <template v-slot:top-right>
                    <q-icon
                      name="refresh"
                      size="md"
                      class="q-px-sm cursor-pointer"
                      @click="filterRequests()"
                    >
                      <q-tooltip>Refresh</q-tooltip>
                    </q-icon>
                    <q-icon name="file_download" size="md" class="q-px-sm cursor-pointer">
                      <q-tooltip>Export Excel</q-tooltip>
                    </q-icon>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td v-for="item in props.cols" :key="item.name" :props="props">
                        <span v-if="item.name == 'isChecked'">
                          <q-checkbox
                            v-model="props.row.isChecked"
                            color="warning"
                            @click.capture="
                              changeChecked(props.row.id, props.row.isChecked, $event)
                            "
                          />
                        </span>
                        <span v-else>
                          {{ item.value }}
                        </span>
                      </q-td>
                    </q-tr>
                  </template>
                  <template v-slot:loading>
                    <q-inner-loading showing color="warning" />
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="showConfirmModal" transition-show="scale" transition-hide="scale">
      <q-card class="bg-dark text-white" style="width: 1000px">
        <q-card-section>
          <div class="text-h6">Confirmation</div>
        </q-card-section>
        <q-card-section class="bg-white text-black">
          <div>
            <h6 class="no-margin">Are you sure?</h6>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white">
          <q-btn
            label="Cancel"
            v-close-popup
            no-caps
            class="text-black bg-white"
            unelevated
            outline
            icon="clear"
          />
          <q-btn
            :label="isCheckedValue ? 'Check' : 'Uncheck'"
            no-caps
            class="bg-warning text-black"
            unelevated
            icon="done"
            @click="setIsChecked"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import { Loading, date, useQuasar } from "quasar";
import BaseDatePicker from "src/components/BaseDatePicker.vue";

export default {
  data() {
    return {
      applyList: [],
      loadingTable: true,
      columns: [
        {
          name: "fullName",
          label: "ّFull Name",
          field: (row) => row.fullName,
          sortable: true,
          align: "left",
          style: "width:150px",
        },
        {
          name: "phone",
          label: "ّPhone",
          field: (row) => row.phone,
          sortable: true,
          align: "left",
          style: "width:150px",
        },
        {
          name: "country",
          label: "Country",
          field: (row) => row.country,
          sortable: true,
          align: "left",
          style: "width:150px",
        },
        {
          name: "email",
          label: "Email",
          field: (row) => row.email,
          sortable: true,
          align: "left",
          style: "width:150px",
        },
        {
          name: "CreatedDate",
          label: "Apply Date",
          field: (row) => date.formatDate(row.CreatedDate, "YYYY/MM/DD - HH:mm:ss"),
          sortable: true,
          align: "left",
          style: "width:150px",
        },
        {
          name: "isChecked",
          sortable: true,
          label: "Checked",
          align: "left",
          style: "width:0px",
        },
      ],
      fromDate: null,
      toDate: null,
      isChecked: null,
      showConfirmModal: false,
      isCheckedId: null,
      isCheckedValue: null,
    };
  },
  components: {
    BaseDatePicker,
  },
  created() {
    this.getApplyList();
  },
  methods: {
    async getApplyList(data) {
      this.loadingTable = true;
      let response = await api.get(`/Register?${data}`);
      this.applyList = response.data;
      this.loadingTable = false;
    },
    async filterRequests() {
      const data = {
        from: this.fromDate ? this.fromDate : "",
        to: this.toDate ? this.toDate : "",
        isChecked: this.isChecked,
      };
      if (this.isChecked === null) {
        delete data.isChecked;
      }
      this.applyList = [];
      await this.getApplyList(new URLSearchParams(data).toString());
    },
    changeChecked(id, value, event) {
      event.stopPropagation();
      this.isCheckedId = id;
      this.isCheckedValue = !value;
      this.showConfirmModal = true;
    },
    async setIsChecked() {
      this.loadingTable = true;
      let response = await api.patch(`Register/${this.isCheckedId}`, {
        isChecked: this.isCheckedValue,
      });
      this.applyList = [];
      await this.getApplyList();
      this.loadingTable = false;
      this.showConfirmModal = false;
      if (response.status === 200) {
        this.$q.notify({
          type: "dark",
          message: `Changed status ${this.isCheckedValue ? "Cheked" : "Unchecked"}.`,
          position: "top",
          icon: "done",
          progress: true,
          textColor: "warning",
        });
      }
    },
  },
};
</script>

<style scoped></style>
