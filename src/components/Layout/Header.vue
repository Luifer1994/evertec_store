<template>
  <div style="width: 100%" class="sticky-top">
    <div class="container mb-5">
      <div class="row d-flex justify-content-center">
        <div class="col-md-12">
          <div class="card">
            <div class="d-flex justify-content-between align-items-center">
              <router-link to="/">
                <img
                  src="https://www.evertecinc.com/wp-content/uploads/2020/07/logo-evertec.png"
                  width="150"
                  alt=""
                />
              </router-link>

              <div class="d-flex flex-row mr-2">
                <router-link to="/cart" class="new">
                  <i
                    style="font-size: 35px; color: #ff6c0c"
                    class="fas fa-shopping-bag"
                  ></i>

                  <span id="checkout_items" class="checkout_items">
                    {{ val }}
                  </span>
                </router-link>

                <div class="m-2">
                  <router-link to="/clinents-orders">
                    <h6>Mis pedidos</h6>
                  </router-link>
                </div>
                <div class="m-2">
                  <router-link to="/list-orders">
                    <h6>Pedidos del sistema</h6>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      val: this.$store.state.cart.length,
      urlApi: process.env.VUE_APP_URL_API,
    };
  },
  mounted() {
    this.emitter.on("add", () => {
      this.val = this.$store.state.cart.length;
    });
  },
};
</script>
<style>
.name-product {
  font-weight: bold;
  color: rgb(33, 33, 104);
}
</style>