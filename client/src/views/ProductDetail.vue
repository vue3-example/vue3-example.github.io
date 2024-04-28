<template>
    <main class="mt-3">
        <div class="container">
            <div class="row">
                <div class="col-md-5">
                    <div id="carouselExampleIndicators" class="carousel carousel-dark slide" data-bs-ride="carousel">
                        <ol class="carousel-indicators">
                            <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"></li>
                            <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
                            <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>
                        </ol>
                        <div class="carousel-inner">
                            <div
                                :class="`carousel-item ${i == 0 ? 'active' : ''}`"
                                :key="i"
                                v-for="(pimg, i) in productImage"
                            >
                                <img :src="`/download/${productId}/${pimg.path}`" class="d-block w-100" alt="..." />
                            </div>
                        </div>
                        <a
                            class="carousel-control-prev"
                            href="#carouselExampleIndicators"
                            role="button"
                            data-bs-slide="prev"
                        >
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </a>
                        <a
                            class="carousel-control-next"
                            href="#carouselExampleIndicators"
                            role="button"
                            data-bs-slide="next"
                        >
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </a>
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">{{ productDetail.product_name }}</h5>
                            <h5 class="card-title pt-3 pb-3 border-top">
                                {{ getCurrencyFormat(productDetail.product_price) }}원
                            </h5>
                            <p class="card-text border-top pt-3">
                                <span class="badge bg-dark me-1">{{ productDetail.category1 }}</span>
                                <span class="badge bg-dark me-1">{{ productDetail.category2 }}</span>
                                <span class="badge bg-dark">{{ productDetail.category3 }}</span>
                            </p>
                            <p class="card-text pb-3">
                                배송비 {{ getCurrencyFormat(productDetail.delivery_price) }}원 | 도서산간(제주도) 배송비
                                추가 {{ getCurrencyFormat(productDetail.add_delivery_price) }}원 | 택배배송 |
                                {{ productDetail.outbound_days }}일 이내 출고 (주말,공휴일 제외)
                            </p>
                            <div class="card-text border-top pb-3">
                                <div class="row">
                                    <div class="col-auto">
                                        <label class="col-form-label">구매수량</label>
                                    </div>
                                    <div class="col-auto">
                                        <div class="input-group">
                                            <span
                                                class="input-group-text"
                                                style="cursor: pointer"
                                                @click="calculatePrice(-1)"
                                                >-</span
                                            >
                                            <input
                                                type="text"
                                                class="form-control"
                                                style="width: 40px"
                                                v-model="total"
                                            />
                                            <span
                                                class="input-group-text"
                                                style="cursor: pointer"
                                                @click="calculatePrice(1)"
                                                >+</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row pt-3 pb-3 border-top">
                                <div class="col-6">
                                    <h3>총 상품 금액</h3>
                                </div>
                                <div class="col-6" style="text-align: right">
                                    <h3>{{ getCurrencyFormat(totalPrice) }}원</h3>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="col-6 d-grid p-1">
                                    <button type="button" class="btn btn-lg btn-dark">장바구니 담기</button>
                                </div>
                                <div class="col-6 d-grid p-1">
                                    <button type="button" class="btn btn-lg btn-danger">주문하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <img :src="`/download/${productId}/${productDetail.path}`" class="img-fluid" />
                </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            // 받아온 data를 template 코드에 쓸 수 있게 data 정의
            productId: 0,
            productDetail: {},
            productImage: [],
            total: 1,
            totalPrice: 0
        };
    },
    created() {
        this.productId = this.$route.query.product_id; //path의 product_id를 productId로 선언
        this.getProductDetail(); // created 단계에서 productDetail를 실행시켜 data를 미리 호출
        this.getProductImage(); // created 단계에서 getProductImage를 실행시켜 data를 미리 호출
    },
    methods: {
        calculatePrice(cnt) {
            let total = this.total + cnt; // cnt를 받아 수량(total)을 나타냄 (total 초기값 = 0)
            if (total < 1) total = 1; // total이 0보다 작을 땐 total은 무조건 0
            this.total = total;
            this.totalPrice = this.productDetail.product_price * this.total; // totalPrice는 제품 가격 * 수량
        },
        getCurrencyFormat(value) {
            // 가격의 ,을 새겨주는 $currencyFormat 호출
            return this.$currencyFormat(value);
        },
        async getProductDetail() {
            let productDetail = await this.$api('/api/productDetail', { param: [this.productId] }); //param요소는 object요소에 의해 불러와지는 매개변수들을  배열함.

            if (productDetail.length > 0) {
                this.productDetail = productDetail[0];
                this.totalPrice = this.totalPrice = this.productDetail.product_price * this.total;
            }
            console.log(this.productDetail); // 데이터를 잘 받아오는지 확인
        },
        async getProductImage() {
            this.productImage = await this.$api('/api/productMainImages', { param: [this.productId] });
            console.log('this.productImage', this.productImage);
        }
    }
};
</script>

<style></style>
