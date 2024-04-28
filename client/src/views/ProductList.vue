<template>
    <main class="mt-5">
        <div class="container">
            <div class="row mb-2">
                <div class="col-12">
                    <select class="form-select">
                        <option selected></option>
                        <option value="1">BEST 10%</option>
                        <option value="2">TOP 10</option>
                        <option value="3">EVENT 10% ~ 80%</option>
                    </select>
                </div>
            </div>
            <div v-if="productList == 0" class="row">
                <h5 class="m-4">등록된 상품이 없습니다.</h5>
            </div>
            <div class="row">
                <div class="col-xl-3 col-lg-4 col-md-6" :key="i" v-for="(product, i) in productList">
                    <div class="card" style="width: 18rem">
                        <a @click="goToDetail(product.id)" style="cursor: pointer"
                            ><img :src="`/download/${product.id}/${product.path}`" class="card-img-top" alt="..."
                        /></a>
                        <div class="card-body">
                            <h5 class="card-title">{{ product.product_name }}</h5>
                            <p class="card-text">
                                <span class="badge bg-dark text-white me-1">{{ product.category1 }}</span>
                                <span class="badge bg-dark text-white me-1">{{ product.category2 }}</span>
                                <span class="badge bg-dark text-white">{{ product.category3 }}</span>
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-sm btn-outline-secondary">
                                        장바구니 담기
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary">주문하기</button>
                                </div>
                                <small class="text-dark">{{ product.product_price }}원</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        // 받아온 data를 template 코드에 쓸 수 있게 data 정의
        return {
            productList: []
        };
    },
    created() {
        this.getProductList(); // created 단계에서 getProductList를 실행시켜 data 미리 호출
    },
    methods: {
        // 메소드 호출
        async getProductList() {
            // getProductList 메소드 호출
            this.productList = await this.$api('/api/productList', {}); // url를 따라 app.js의 /api/:alias를 타고 sql productList의 data 호출
            console.log(this.productList); // 데이터를 잘 받아오는지 확인
        },
        goToDetail(product_id) {
            // 제품 이미지 클릭시 product_id를 받아 제품 상세페이지로 router되도록 설정
            this.$router.push({ path: '/detail', query: { product_id: product_id } }); // path중 /detail이 들어가면 product_id를 파라미터로 받아 라우터 시킴
        }
    }
};
</script>

<style></style>
