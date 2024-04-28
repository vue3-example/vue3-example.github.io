<template>
    <div>
        <b-navbar toggleable="lg" variant="dark" class="m-0">
            <router-link class="colorWtB" to="/">Logo</router-link>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav class="text-light">
                <b-navbar-nav>
                    <router-link to="/" class="colorWt">상품리스트</router-link>
                    <router-link to="/detail" class="colorWt">상세페이지</router-link>
                    <router-link to="/create" class="colorWt">제품등록페이지</router-link>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <button
                        v-if="user.profile == undefined"
                        class="btn btn-danger m-1"
                        type="button"
                        @click="kakaoLoin"
                    >
                        로그인
                    </button>
                    <button v-else class="btn bg-primary text-white m-1" type="button" @click="kakaoLogout">
                        로그아웃
                    </button>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'header',
    computed: {
        //상태감지. 데이터가 변경되는지확인하여
        user() {
            return this.$store.state.user; //변경된 정보로 변경되도록
        }
    },
    methods: {
        kakaoLoin() {
            window.Kakao.Auth.login({
                scope: 'profile_image, profile_nickname', //profile_image, profile_nickname
                success: this.getProfile
            });
        },
        getProfile(authObj) {
            //로그인이 성공하면 파라미터 값이 생성됨.
            console.log(authObj);
            window.Kakao.API.request({
                // 웹 페이지에서 JavaScript SDK를 통해 카카오톡 메시지 API를 사용하려면 Kakao.API.request 함수를 사용해 REST API와 같은 URL로 요청
                url: '/v2/user/me', //로그인 정보
                success: (res) => {
                    // eslint-disable-next-line camelcase
                    const kakao_account = res.kakao_account;
                    const profile = kakao_account.profile_image; //카카오 프로필
                    const nickname = kakao_account.profile.nickname; //카카오 닉네임

                    console.log('profile', profile);
                    console.log('nickname', nickname);

                    console.log(kakao_account);
                    this.login(kakao_account), alert('로그인 성공!');
                }
            });
        },
        // eslint-disable-next-line camelcase
        async login(kakao_account) {
            /*             await this.$api('/api/login', {
                param: [{ profile: kakao_account.profile_image }, { nickname: kakao_account.profile_nickname }]
            }); */

            this.$store.commit('user', kakao_account);
        },
        kakaoLogout() {
            window.Kakao.Auth.logout((response) => {
                console.log(response);
                this.$store.commit('user', {}); //정보 비우기
                alert('로그아웃');
                this.$router.push({ path: '/' });
            });
        }
    }
};
</script>

<style>
.colorWtB {
    color: #ffffff;
    text-decoration: none;
    padding: 0 30px;
    font-weight: bold;
}
.colorWt {
    color: #cccccc;
    text-decoration: none;
    padding: 0 10px;
}
.colorWt:hover {
    color: #ffffff;
    text-decoration: none;
    padding: 0 10px;
}
.colorWt:focus {
    color: #ffffff;
    text-decoration: none;
    padding: 0 10px;
}
.navbar-toggler {
    border: 2px solid #fff !important;
}
.navbar-toggler-icon {
    /* background-imgage: */
}
</style>
