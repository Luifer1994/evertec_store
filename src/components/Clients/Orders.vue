<template>
  <div class="container mt-5 mb-5">
    <div class="card">
      <div v-if="!dataClient">
        <h5>Ingresa tu email para buscar tus ordenes</h5>
        <div class="row">
          <div class="col-sm-12 col-md-8 col-lg-8">
            <input
              type="email"
              v-model="email"
              class="form-control"
              :class="{
                'is-invalid': errors.email,
              }"
            />
            <small v-if="errors.email" class="text-danger">{{
              errors.email[0]
            }}</small>
          </div>
          <div class="col">
            <button
              class="btn btn-warning text-white"
              @click="getOrders()"
              v-if="!loading"
            >
              Buscar pedidos
            </button>
            <button class="btn btn-warning text-white" disabled v-else>
              Cargando...
            </button>
          </div>
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">TOTAL</th>
              <th scope="col">ID_DE_PAGO</th>
              <th scope="col">ESTADO</th>
              <th scope="col">FECHA_CREACIÓN</th>
              <th scope="col">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in client.orders" :key="order.id">
              <th scope="row">{{ order.id }}</th>
              <td>${{ formatPrice(order.total) }}</td>
              <td>{{ order.payment_id }}</td>
              <td>
                <span
                  :class="{
                    'badge-success': order.status == 'PAYED',
                    'badge-warning': order.status == 'CREATED',
                    'badge-danger': order.status == 'REJECTED',
                    'badge-primary': order.status == 'PENDING',
                  }"
                  class="badge"
                  style="font-size: 15px"
                  >{{ retunrStatus(order.status) }}</span
                >
              </td>
              <td>{{ formatDate(order.id) }}</td>
              <td>
                <button
                  v-if="order.status !== 'PAYED'"
                  class="btn btn-warning text-white"
                  @click="retryPayment(order.uuid)"
                >
                  PAGAR
                </button>
                <button v-else class="btn btn-warning text-white" disabled>
                  PAGAR
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "ClientsOrders",

  data() {
    return {
      urlApi: process.env.VUE_APP_URL_API,
      dataClient: false,
      client: {},
      loading: false,
      email: null,
      errors: {},
    };
  },
  methods: {
    async getOrders() {
      try {
        this.loading = true;
        const res = await axios.get(
          this.urlApi + "client-get-orders?email=" + this.email
        );
        this.client = res.data.data;
        this.loading = false;
        this.dataClient = true;
      } catch (error) {
        this.errors = error.response.data;
        this.loading = false;
      }
    },
    async retryPayment(uuid) {
      try {
        this.loading = true;
        const res = await axios.get(
          this.urlApi + "order-retry-payment/" + uuid
        );

        if (res.data.res) {
          window.location.href = res.data.data.url_payment;
          this.loading = false;
        }
      } catch (error) {
        console.log(error.response.message);
        this.loading = false;
      }
    },
    formatDate(value) {
      moment.locale("es");
      if (value) {
        return moment(String(value)).format("LL");
      }
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    retunrStatus(status) {
      switch (status) {
        case "PAYED":
          return "PAGADO";
        case "CREATED":
          return "CREADO";
        case "REJECTED":
          return "RECHAZADO";
        case "PENDING":
          return "PENDIENTE";
      }
    },
  },
};
</script>