import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal;

const app = createApp({
  data() {
    return {
      apiHex: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'travel590',
      products: [],
      tempProduct: {},
      isNew: false,
      isDelete: false,
      pagination: {}
    }
  },
  methods: {
    // 驗證 token
    checkToken(){
        const url = `${this.apiHex}/api/user/check`;
        axios.post(url).then((res) => {
            if(res.data.success){
                this.getData();
            } else {
                window.location = 'index.html';
            }
        }).catch((error) => {
            alert(error.data.message);
            window.location = 'index.html';
        })
    },
    // 開啟產品 modal
    checkModal(item, data){
        if(item === '新增資料'){
          this.tempProduct = {}
          this.isDelete = false;
          this.isNew = true
          productModal.show();
        } else if (item === '編輯資料'){
          this.tempProduct = { ...data };
          this.isNew = false;
          productModal.show();
        } else if (item === '刪除資料'){
          console.log('刪除資料')
          this.tempProduct = { ...data };
          console.log( {...data} )
          this.isNew = false
          this.isDelete = true;
          productModal.show();
        }
    },
    // 取得資料
    getData(page = 1){
      const url = `${this.apiHex}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url).then((res) => {
        console.log(res)
        this.products = res.data.products;
        this.pagination = res.data.pagination
      }).catch((error) => {
        alert(error.data.message);
      })
    },
    // 產品細節
    openDetail(res){
      this.tempProduct = res;
    },
    // 更改狀態
    changeEnabled(res){
      res.is_enabled = !res.is_enabled;
      this.tempProduct = res;
      let id = this.tempProduct.id
      const url = `${this.apiHex}/api/${this.apiPath}/admin/product/${id}`;
      axios.put(url, { data: this.tempProduct }).then(() => {
        alert('成功修改')
      }).catch((error) => {
        alert(error.data.message);
      })
    },
    // 刪除產品
    deleteProduct(){
      let id = this.tempProduct.id;
      const url = `${this.apiHex}/api/${this.apiPath}/admin/product/${id}`;
      axios.delete(url).then(() => {
        productModal.hide();
        this.getData()
      }).catch((error) => {
        alert(error.data.message);
      })
    },
    // 新增產品
    addProduct(){
      const url = `${this.apiHex}/api/${this.apiPath}/admin/product`;
      // 轉換原價、售價型別
      this.tempProduct.origin_price = Number(this.tempProduct.origin_price);
      this.tempProduct.price = Number(this.tempProduct.price);
  
      axios.post(url, { data: this.tempProduct }).then((res) => {
        if (res.data.success) {
          productModal.hide();
          this.getData();
        } else {
          alert(res.data.message);
        }
      }).catch((error) => {
        alert(error.data.message)
      })
    },
    // 編輯產品
    editProduct(){
      let id = this.tempProduct.id
      this.tempProduct.origin_price = Number(this.tempProduct.origin_price);
      this.tempProduct.price = Number(this.tempProduct.price);

      const url = `${this.apiHex}/api/${this.apiPath}/admin/product/${id}`;
      axios.put(url, { data: this.tempProduct }).then(() => {
        alert('成功修改')
        productModal.hide();
        this.getData();
      }).catch((error) => {
        alert(error.data.message)
      })
    },
    // 圖片上傳
    uploadImg(e){
      console.log('觸發了')
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append('file-to-upload', file);
      
      const url = `${this.apiHex}/api/${this.apiPath}/admin/upload`;
      axios.post(url, formData).then((res) => {
       this.tempProduct.imageUrl = res.data.imageUrl;
       console.log(res.data.imageUrl)
      }).catch((error) => {
        alert(error.data.message)
      })
    },
  },
  mounted(){
    // 選取產品 modal  
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {});
  },
  created(){
      // 取出 token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

      // 在 axios 的抬頭加上 token
      axios.defaults.headers.common.Authorization = token;
      this.checkToken()
  }
})
.component('pagination', {
    props:['page'],
    template: '#pagination',
})
.component('productModal', {
  props: ['tempProduct', 'isNew', 'isDelete'],
  template: '#productModal',
  methods: {
}
})
app.mount('#app');