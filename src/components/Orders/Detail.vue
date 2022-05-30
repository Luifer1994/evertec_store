<template>
  <div class="container mt-5 mb-5">
    <div class="card">
      <div
        class="d-flex justify-content-center"
        style="padding-top: 150px; margin-bottom: 150px"
        v-if="loading"
      >
        <h2>Cargando...</h2>
      </div>
      <div v-else class="card-body">
        <h4>DETALLE DE ORDEN N° {{ order.id }}</h4>
        <div class="row">
          <div class="col-sm-6 col-md-3">
            <h5>ESTADO:</h5>
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
          </div>
          <div class="col-sm-6 col-md-3">
            <h5>TOTAL:</h5>
            <h4>$ {{ formatPrice(order.total) }}</h4>
          </div>
          <div class="col-sm-6 col-md-3">
            <h5>ID DE PAGO:</h5>
            <h4>{{ order.payment_id }}</h4>
          </div>
          <div class="col-sm-12 col-md-3">
            <h5>FECHA DE ORDEN:</h5>
            <h4>{{ formatDate(order.created_at) }}</h4>
          </div>
        </div>
        <br />
        <div class="row" v-if="order.client">
          <div class="col-sm-12 col-md-6">
            <h5>CLIENTE:</h5>
            <h4>{{ order.client.name }} {{ order.client.last_name }}</h4>
          </div>
          <div class="col">
            <h5>DOCUMENTO:</h5>
            <h4>
              {{ order.client.document_type.cod }} -
              {{ order.client.document_number }}
            </h4>
          </div>
        </div>
        <br />
        <div class="row" v-if="order.order_lines">
          <div class="col">
            <h5>PRODUCTOS:</h5>
            <div class="row">
              <div
                v-for="product in order.order_lines"
                :key="product.id"
                class="col"
              >
                <div class="">
                  <img
                    width="150"
                    :src="product.product.image"
                    class="img-thumbnail"
                    alt="..."
                  />
                </div>
                <h4 class="text-warning">{{ product.product.name }}</h4>
                <h5>Cantidad: {{ product.quantity }}</h5>
              </div>
            </div>
          </div>
        </div>
        <div v-if="loading">
          <button class="btn btn-warning text-white" disabled>
            Crgando...
          </button>
        </div>

        <div v-else>
          <button
            v-if="order.status !== 'PAYED' || loading"
            class="btn btn-warning text-white"
            @click="retryPayment(order.uuid)"
          >
            REINTENTAR PAGO
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "DetailOrder",
  mounted() {
    this.getDetailOrder();
  },

  data() {
    return {
      urlApi: process.env.VUE_APP_URL_API,
      order: {},
      loading: false,
    };
  },
  methods: {
    async getDetailOrder() {
      this.loading = true;
      const res = await axios.get(
        this.urlApi + "order-show/" + this.$route.params.id
      );
      this.order = res.data.data;
      this.loading = false;
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