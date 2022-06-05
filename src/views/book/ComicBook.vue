<template>
  <div class="book-container">
    <div class="book-video" v-if="getTypeBook === 'video' || getTypeBook === 'audio'">
      <ol class="media-list" v-if="!isMobile()">
        <li :class="{active: media.id === activeMedia.id}"
            v-for="media of book?.files"
            :key="media.id"
            @click="activeMedia = media">
          <button class="btn media-name">{{ media.file_name }}</button>
        </li>
      </ol>
      <select class="select" v-else-if="isMobile()" v-model="activeMedia">
        <option :value="media" v-for="media of book.files" :key="media.id">{{ media.file_name }}</option>
      </select>
      <figure class="media-video">
        <video class="video" :src="getSrcUrl" controls v-if="activeMedia.type.includes('video/')"></video>
        <audio class="audio" :src="getSrcUrl" controls v-else-if="activeMedia.type.includes('audio/')"></audio>
      </figure>
    </div>

    <div class="book-picture" v-else-if="getTypeBook === 'picture'">
      <image-item class="book-picture_img cap" :source="getSrcImgUrl(media)" v-for="media of book.files" :key="media.id"
                  @click="activeImage = getSrcImgUrl(media)"></image-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import useBook from "../../composables/useBook";
import {isMobile} from "../../utils/helpers";
import ImageItem from "@/components/ImageItem.vue";

import {API_URL} from "../../../runtimeEnv";
import { BookDirFile } from "../../interfaces/book";


interface Category {
    id: number,
    name: string
}

interface Genre {
    [key: string]: number|string|Category|boolean
    id: number,
    name: string,
    description: string,
    category: Category,
    ad: boolean,
    created_at: number,
}
interface BookFile {
    created_at: number,
    extension: string,
    file_name: string,
    full_name: string,
    id: number,
    path: string,
    size: number,
    type: string,
    url: string,
}

interface Book {
    id: number,
    name: string,
    annotation?: string,
    text?: string,
    book_type?: string,
    source?: string,
    bookmark?: number,
    rating?: number,
    ad?: boolean,
    genres: Array<Genre>
    cover_path?: string,
    files?: Array<BookFile>,
    view_count?: number,
    created_at?: number,
    updated_at?: number,
    last_read?: number,
}

const route = useRoute();
const {book, downloadBook} = useBook();
const activeImage = ref('');
const activeMedia = ref({id: 0, type: '', url: ''});
const getTypeBook = computed(() => {
  if (book.value.genres.findIndex(item => item.name === 'picture') !== -1) {
    return 'picture'
  } else if (book.value.genres.findIndex(item => item.name === 'audio') !== -1) {
    return 'audio'
  } else if (book.value.genres.findIndex(item => item.name === 'video') !== -1) {
    return 'video'
  } else return ''
})
const getSrcUrl = computed(() => {
  return activeMedia.value.url ? `${API_URL}/${activeMedia.value.url}` : ''
})

function getSrcImgUrl(e:BookDirFile) {
  return e.url ? `${API_URL}/${e.url}` : ''
}
downloadBook(+route.params.id)
</script>

<style lang="scss">
.book-container {
  background-color: var(--background);

  .book-picture {
    display: flex;
    flex-flow: row wrap;
  }

  .book-picture_img {
    object-fit: cover;
  }
  .book-picture_img.cap {
    width: 100%;
    min-height: 300px;
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
        color: var(--primary)
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

.mobile .book-container {
  height: calc(100vh - 3.5rem);
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
  .book-container {
    .book-video {
      .media-video {
        //height: 288px;
        .video {
          height: 288px;
        }
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .book-container {
  }
}
</style>