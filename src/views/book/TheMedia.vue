<template>
  <div class="book-container">
    <div class="book-video" v-if="getTypeBook === 'video' || getTypeBook === 'audio'">
      <ol class="media-list" v-if="main.isDesktop">
        <li :class="{active: media.id === activeMedia.id}"
            v-for="media of book.files"
            :key="media.id"
            @click="activeMedia = media">
          <span class="media-name">{{ media.file_name }}</span>
        </li>
      </ol>
      <select v-else-if="main.isMobile" v-model="activeMedia">
        <option :value="media" v-for="media of book.files" :key="media.id">{{ media.file_name }}</option>
      </select>
      <figure class="media-video">
        <video :src="getSrcUrl" controls v-if="activeMedia.type === 'video/webm'"></video>
        <audio :src="getSrcUrl" controls v-else-if="activeMedia.type === 'audio/mpeg'"></audio>
      </figure>
    </div>

    <div class="book-picture" v-else-if="getTypeBook === 'picture'">
      <img class="book-picture_img" :src="getSrcImgUrl(media)" alt="" v-for="media of book.files" :key="media.id"
           @click="activeImage = getSrcImgUrl(media)">
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {$get} from "@/service/superFetch";

const apiUrl = process.env.VUE_APP_API_URL
export default {
  name: "TheMedia",
  components: {},
  props: {},
  data: () => ({
    book: {annotation: null, text: null, genres: []},
    activeImage: null,
    activeImageIndex: 0,
    activeMedia: {type: null, url: null},
  }),
  computed: {
    ...mapState({
      main: state => state.main,
    }),
    getTypeBook() {
      if (this.book.genres.findIndex(item => item.name === 'picture') !== -1) {
        return 'picture'
      } else if (this.book.genres.findIndex(item => item.name === 'audio') !== -1) {
        return 'audio'
      } else if (this.book.genres.findIndex(item => item.name === 'video') !== -1) {
        return 'video'
      } else return ''
    },
    getSrcUrl() {
      return this.activeMedia.url ? `${apiUrl}/${this.activeMedia.url}` : ''
    },
  },
  watch: {},
  created() {
    this.loadBook()
  },
  mounted() {
  },
  methods: {
    async loadBook() {
      const url = `/book/view?id=${this.$route.params.id}`;
      try {
        this.book = await $get(url)
      }catch (e) {
        console.log({'loadBook': e})
      }


    },
    getSrcImgUrl(e) {
      return e.url ? `${apiUrl}/${e.url}` : ''
    },
  },
}
</script>

<style scoped lang="scss">

</style>