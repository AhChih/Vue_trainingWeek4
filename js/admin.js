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
          console.log('新增資料')
          this.tempProduct = {}
          this.isDelete = false;
          this.isNew = true
          productModal.show();
        } else if (item === '編輯資料'){
          console.log('編輯資料')
          this.tempProduct = { ...data };
          this.isNew = false;
          productModal.show();
        } else if (item === '刪除資料'){
          console.log('刪除資料')
          this.tempProduct = { ...data };
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
      }).catch(() => {
        console.log('錯誤')
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
      axios.put(url, { data: this.tempProduct }).then((res) => {
        console.log(res)
      })
    },
    // 新增產品
    addProduct(){
      console.log('我被觸發了')
      // const url = `${this.apiHex}/api/${this.apiPath}/admin/product`;
      // // 轉換原價、售價型別
      // this.tempProduct.origin_price = Number(this.tempProduct.origin_price);
      // this.tempProduct.price = Number(this.tempProduct.price);
  
      // axios.post(url, { data: this.tempProduct }).then((res) => {
      //   if (res.data.success) {
      //     productModal.hide();
      //     this.getData();
      //   } else {
      //     alert(res.data.message);
      //   }
      // }).catch((error) => {
      //   alert(error.data.message)
      // })
    },
    // 刪除產品
    deleteProduct(){
      let id = this.tempProduct.id;
      const url = `${this.apiHex}/api/${this.apiPath}/admin/product/${id}`;
      axios.delete(url).then(() => {
        productModal.hide();
        this.getData()
      }).catch(() => {
        console.log('錯誤')
      })
    },
    // 編輯產品
    editProduct(){
      let id = this.tempProduct.id
      this.tempProduct.origin_price = Number(this.tempProduct.origin_price);
      this.tempProduct.price = Number(this.tempProduct.price);

      const url = `${this.apiHex}/api/${this.apiPath}/admin/product/${id}`;
      axios.put(url, { data: this.tempProduct }).then(() => {
        console.log('成功')
        productModal.hide();
        this.getData();
      }).catch(() => {
        console.log('錯誤')
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
  template: `<div class="modal fade" id="productModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" v-if="isNew === true">新增產品</h5>
        <h5 class="modal-title" v-if="!isNew && !isDelete">編輯產品</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" v-if="!isDelete">
        <div class="d-flex">
          <div class="form-group px-2">
            <label class="form-label" for="title">產品標題</label>
            <input v-model="tempProduct.title" class="form-control" type="text">
          </div>

          <div class="form-group px-2">
            <label class="form-label" for="category">產品分類</label>
            <input v-model="tempProduct.category" class="form-control" id="category" type="text">
          </div>


          <div class="form-group px-2">
            <label class="form-label" for="unit">產品單位</label>
            <input v-model="tempProduct.unit" class="form-control" id="unit" type="text">
          </div>
        </div>

        <div class="d-flex my-3">
          <div class="form-group px-2">
            <label class="form-label" for="origin_price">產品售價</label>
            <input v-model="tempProduct.origin_price" class="form-control" id="origin_price" type="number">
          </div>

          <div class="form-group px-2">
            <label class="form-label" for="price">產品原價</label>
            <input v-model="tempProduct.price" class="form-control" id="price" type="number">
          </div>
        </div>

        <div class="form-group mt-3 px-2">
          <label class="form-label" for="description">產品描述</label>
          <textarea v-model="tempProduct.description" class="form-control" id="description" type="text"></textarea>
        </div>

        <div class="form-group mt-3 px-2">
          <label class="form-label" for="content">產品說明</label>
          <textarea v-model="tempProduct.content" class="form-control" id="content" type="text"></textarea>
        </div>

        <div class="form-group mt-3 px-2">
          <label for="formFile" class="form-label">Default file input example</label>
          <input class="form-control" name="file-to-upload" type="file" id="formFile" @change="uploadImg">
        </div>

        <div class="form-group mt-3">
          <div class="form-check">
            <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input" type="checkbox"
              :true-value="1" :false-value="0">
            <label class="form-check-label" for="is_enabled">是否啟用</label>
          </div>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        <button type="button" class="btn btn-primary" v-if="isNew === true" @click="$emit('add-product()')">確定新增</button>
        <button type="button" class="btn btn-primary" v-if="!isNew && !isDelete" @click="editProduct()">確定更改</button>
        <button type="button" class="btn btn-danger" v-if="isDelete === true" @click="deleteProduct()">確定刪除</button>
      </div>
    </div>
  </div>
</div> `,
methods: {
    // 圖片上傳
    uploadImg(e){
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append('file-to-upload', file);
      
      const url = `${this.apiHex}/api/${this.apiPath}/admin/upload`;
      axios.post(url, formData).then((res) => {
       this.tempProduct.imageUrl = res.data.imageUrl;
      })
    }
}
})
app.mount('#app');