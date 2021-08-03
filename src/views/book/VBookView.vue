<template>
  <component :is="typeBook" :book="book"></component>
</template>

<script>
import {defineAsyncComponent, ref} from "vue";
import {useRoute} from 'vue-router';
import {loadBook} from "../../utils/loadData";

export default {
  name: "Book",
  components: {
    BookText: defineAsyncComponent(() => import('@/components/BookText.vue')),
    BookMedia: defineAsyncComponent(() => import('@/components/BookMedia.vue')),
    BookEmpty: defineAsyncComponent(() => import('@/components/BookEmpty.vue'))
  },
  emits: ['loaded-book'],
  props: {},
  setup() {
    const route = useRoute();
    const book = ref({})
    const typeBook = ref('book-empty')

    const downloadBook = async () => {
      book.value = await loadBook(route.params.id)
      const comicsBook = book.value.genres.findIndex(genre => genre.category.name === 'comics') > -1
      typeBook.value = comicsBook ? 'book-media' : 'book-text'
    }
    downloadBook()
    return {
      typeBook,
      book,
    }
  },
  data: () => ({
  }),
  methods: {
  },
  computed: {
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  beforeUnmount() {
  },

}
</script>

<style lang="scss">
.book {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  overflow-y: auto;
  height: 100%;
  padding: 1rem;
  justify-content: center;
  content-visibility: auto;

  p {
    word-break: break-word;
    padding: initial;
    text-indent: 1rem;
    margin: 0 0 0.3rem;
    position: relative;

    span[data-tooltip]:hover {
      color: crimson;
    }
  }

  .text {
    max-width: 700px;
    position: relative;

    .media {
      border: none;
      //display: none;
      cursor: pointer;
      width: 480px;
      height: 320px;
    }

    .media--right {
      position: absolute;
      right: -500px;
    }

    .media--left {
      position: absolute;
      left: -500px;
    }

    h1, h2, h3 {
      text-align: center;
      margin-bottom: 0.5rem;
    }
  }

  .picture {
    width: inherit;
    height: inherit;
    object-fit: cover;
  }

  .illustrations {
    display: flex;
    flex: 1;

  }

}

.footer {
  width: 100%;
  height: 1.5rem;
  display: flex;
  padding: 0 0.5rem;
  position: relative;

  .progress {
    width: 100%;
    height: 100%;
    background: var(--bg-secondary);
    position: absolute;
    left: 0;
  }

  .progress-value {
    position: absolute;
    left: 50%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .progress::-webkit-progress-value {
  }
}

.image-modal {
  //display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.9); /* Black w/ opacity */
  .modal-content {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
  }

  /* Caption of Modal Image (Image Text) - Same Width as the Image */
  #caption {
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
    text-align: center;
    color: #ccc;
    padding: 10px 0;
    height: 150px;
  }

  /* Add Animation - Zoom in the Modal */
  .modal-content, #caption {
    animation-name: zoom;
    animation-duration: 0.6s;
  }
}

@keyframes zoom {
  from {
    transform: scale(0)
  }
  to {
    transform: scale(1)
  }
}

/* The Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

@media only screen and (max-width: 892px) {
  .book-container {
    .book {
      .text {
        max-width: initial;
        width: 100%;

        .media {
          position: static;
          width: 100%;
          max-height: calc(var(--media-width) / 1.5);
        }
      }
    }

    .image-modal {
      padding: 0.3rem;
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      .close {
        top: 0;
      }

      .picture-action-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }

      .picture-arrow-btn {
        height: 5rem;
        width: 5rem;
        color: var(--color-2);
        background-color: var(--background-3);
      }

      .modal-content {
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {

}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {

}
</style>