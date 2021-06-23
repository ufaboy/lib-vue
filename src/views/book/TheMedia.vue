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
      <select class="select" v-else-if="main.isMobile" v-model="activeMedia">
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

const apiUrl = process.env.VUE_APP_API_URL
export default {
  name: "TheMedia",
  components: {},
  props: {
    bookProps: Object
  },
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
    this.checkBook()
  },
  mounted() {
  },
  methods: {
    checkBook() {
      if (this.bookProps.id && this.bookProps.id === +this.$route.params.id) {
        this.book = Object.assign({}, this.bookProps)
      } else this.loadBook()
    },
    async loadBook() {
      const url = `/book/view?id=${this.$route.params.id}`;
      try {
        this.book = await this.$get(url)
        document.title = `Book: ${this.book.name}`;
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
.book-container {
  width: 100%;
  .book-picture {
    display: flex;
    flex-flow: row wrap;
  }
  .book-picture_img {
    object-fit: cover;
  }
  .book-video {
    display: flex;
    flex-flow: row nowrap;
    flex: 1;
    height: 100%;
    width: 100%;
    padding: 1rem 2rem;

    .media-list {
      width: 440px;
      margin-right: 1rem;

      li {
        cursor: pointer;
        margin-bottom: 0.5rem;
      }

      li.active {
        color: var(--color-p)
      }

      .media-name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .media-video {
      flex: 1;
      text-align: center;

      video {
        width: 100%;
      }
    }
  }
}
@media only screen and (max-width: 892px) {
  .book-container {
    .book-video {
      display: block;
      padding: 0.5rem;
    }
    .select {
      width: 100%;
      margin-bottom: 0.5rem;
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .book-container {}
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .book-container {}
}
</style>