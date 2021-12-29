<template>
  <div class="media-manager">
    <ol class="ol-dir">
      <li class="li-dir" v-for="(dir, index) of directories" :key="'dir-' + index" @click="activeDirIndex = index">
        {{ dir.dir_name }}
      </li>
    </ol>
    <div class="preview-wrapper">
      <figure class="figure" v-for="(file, index) of activeDir" :key="'file-' + index" @click="openMedia(file)">
        <img class="preview" :src="calcUrl(file)" alt="">
        <figcaption class="figcaption">{{ file.full_name }}</figcaption>
        <div class="btn-bar" v-if="!file.id">
          <button class="fig-btn" @click.stop="attachFile(file.full_name, index)">
            Attach
          </button>
          <button class="fig-btn"
                  @click.stop="deleteFileFromStorage(file.full_name, index)">Delete
          </button>
        </div>

      </figure>
    </div>
    <div class="media-wrapper">
      <img class="media-full" :src="activeMedia.url" alt="" v-if="activeMedia.type === 'image'">
      <video class="media-full" v-else-if="activeMedia.type === 'video'" controls>
        <source :src="activeMedia.url">
      </video>
      <audio class="media-full" v-else-if="activeMedia.type === 'audio'" controls>
        <source :src="activeMedia.url">
      </audio>
      <span>{{ activeMedia.full_name }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import useMedia from "../composables/useMedia";

// eslint-disable-next-line no-undef,no-unused-vars
const props = defineProps({
  categories: Array,
})
const {
  directories,
  activeDirIndex,
  activeMedia,
  activeDir,
  calcUrl,
  openMedia,
  getMediaFiles,
  attachFile,
  deleteFileFromStorage
} = useMedia()
getMediaFiles()

</script>

<style lang="scss">
.media-manager {
  display: flex;
  flex-flow: row nowrap;
  height: calc(100% - 3.5rem);
  padding: 0.5rem 1.5rem;

  .ol-dir {
    margin-right: 1rem;

    .li-dir {
      width: 100px;
      cursor: pointer;
    }
  }

  .preview-wrapper {
    margin-right: 1rem;
    width: 360px;
    display: flex;
    flex-shrink: 0;
    flex-flow: row wrap;
    overflow-y: auto;
    max-height: 100%;

    .figure {
      width: 150px;
      margin: 0 1rem 1rem 0;

      .figcaption {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 0 0 0.5rem 0;
      }

      .btn-bar {
        display: flex;
        flex-flow: row nowrap;

        .fig-btn {
          flex: 1;
          border: 1px solid;
          padding: 5px;
          color: var(--text-secondary);
          background-color: var(--surface);
          cursor: pointer;
        }

        .fig-btn:first-of-type {
          border-radius: 5px 0 0 5px;
          font-weight: bold;
        }

        .fig-btn:last-of-type {
          font-weight: bold;
          color: red;
          border-radius: 0 5px 5px 0;
        }
      }
    }

    .preview {
      width: 150px;
      height: 100px;
      object-fit: cover;
      cursor: pointer;
      border-radius: 5px;
    }
  }

  .media-wrapper {
    display: flex;
    flex-flow: column;

    .media-full {
      max-width: 700px;
      max-height: 600px;
    }
  }
}

</style>