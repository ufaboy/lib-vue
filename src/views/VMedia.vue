<template>
  <div class="media-manager">
    <ol class="ol-dir">
      <li class="li-dir" v-for="(dir, index) of mediaFiles" :key="'dir-' + index" @click="activeDirIndex = index">{{dir.name}}</li>
    </ol>
    <div class="preview-wrapper">
      <img class="preview" :src="calcUrl(file)" alt="" v-for="(file, index) of activeDir" :key="'file-' + index" @click="openMedia(file)">
    </div>
    <div class="media-wrapper">
      <img class="media-full" :src="activeMedia.url" alt="" v-if="activeMedia.type === 'image'">
      <video class="media-full" v-else-if="activeMedia.type === 'video'" controls>
        <source :src="activeMedia.url">
      </video>
      <audio class="media-full" v-else-if="activeMedia.type === 'audio'" controls>
        <source :src="activeMedia.url">
      </audio>
      <span>{{activeMedia.name}}</span>
    </div>

  </div>
</template>

<script>
import useMedia from "../composables/useMedia";
import {computed, ref} from "vue";
export default {
  name: "VMedia",
  components: {},
  props: {
    categories: Array,
  },
  emits: [],
  setup() {
    const activeDirIndex = ref();
    const activeMedia = ref({});

    const calcUrl = function (file) {
      return `${process.env.VUE_APP_API_URL}/${file.url}`
    }
    const {mediaFiles, getMediaFiles} = useMedia()
    getMediaFiles()
    const activeDir = computed(()=>{
      return mediaFiles.value.length &&  activeDirIndex.value !== undefined ? mediaFiles.value[activeDirIndex.value].files : []
    })
    const openMedia = function (file) {
      activeMedia.value = {name: file.name, url: calcUrl(file), type: file.type.includes('image') ? 'image' : file.type.includes('video') ? 'video' : file.type.includes('audio') ? 'audio' : '' }
    }

    return {mediaFiles, activeDirIndex, activeDir, activeMedia, calcUrl, openMedia}
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {},
}
</script>

<style scoped lang="scss">
.media-manager {
  display: flex;
  flex-flow: row nowrap;
  height: calc(100% - 3.5rem);
  .ol-dir {
    margin-right: 1rem;
    .li-dir {
      width: 100px;
      cursor: pointer;
    }
  }
  .preview-wrapper {
    margin-right: 1rem;
    width: 340px;
    display: flex;
    flex-flow: row wrap;
    overflow-y: auto;
    max-height: 100%;
    .preview {
      width: 150px;
      height: 100px;
      object-fit: cover;
      cursor: pointer;
      margin: 0 0.5rem 0.5rem 0;
    }
  }
  .media-wrapper {
    .media-full {
      max-width: 700px;
      max-height: 700px;
    }
  }
}

</style>