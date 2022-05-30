<template>
  <div class="container mt-5 mb-5">
    <div class="card">
      <div class="card-body table-responsive">
        <div
          class="d-flex justify-content-center"
          style="padding-top: 150px; margin-bottom: 150px"
          v-if="loading"
        >
          <h2>Cargando...</h2>
        </div>
        <table v-else class="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">TOTAL</th>
              <th scope="col">ID_DE_PAGO</th>
              <th scope="col">CLIENTE</th>
              <th scope="col">FECHA_CREACIÓN</th>
              <th scope="col">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <th scope="row">{{ order.id }}</th>
              <td>${{ formatPrice(order.total) }}</td>
              <td>{{ order.payment_id }}</td>
              <td>{{ order.client.name }} {{ order.client.last_name }}</td>

              <td>{{ formatDate(order.created_at) }}</td>
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
            </tr>
          </tbody>
        </table>
        <div class="row">
          <div class="col">
            <nav>
              <ul class="pagination flex-wrap pagination-sm">
                <li
                  class="page-item"
                  v-for="link in links"
                  :key="link"
                  :class="{ active: link.active == true }"
                >
                  <a
                    @click="next(link.label)"
                    style="cursor: pointer"
                    class="page-link"
                    >{{ link.label }}</a
                  >
                </li>
              </ul>
            </nav>
          </div>
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
    this.loading = true;
    this.getOrders();
    this.loading = false;
  },

  data() {
    return {
      urlApi: process.env.VUE_APP_URL_API,
      orders: [],
      loading: false,
      page: 1,
      limit: 7,
    };
  },
  methods: {
    async getOrders(limit = null, page = null) {
      if (limit) {
        this.limit = limit;
      }
      if (page) {
        this.page = page;
      }
      const res = await axios.get(
        this.urlApi + "order-list?limit=" + this.limit + "&page=" + this.page
      );
      this.orders = res.data.data.data;
      this.links = res.data.data.links.slice(1, res.data.data.links.length - 1);
    },
    next(num) {
      this.getOrders(this.limit, num);
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