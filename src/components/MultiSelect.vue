<script setup>
import { ref, computed, defineProps, defineModel, watch, nextTick } from 'vue';

const props = defineProps({
    options: Array,
    keyLabel: String,
    keyValue: String,
});

const model = defineModel()

const searchString = ref('');
const dropdownOpen = ref(false);
const selectedOptions = ref([]);
const checkboxAll = ref(null);

const filteredOptions = computed(() => {
    return props.options?.filter(option => {
        return option[props.keyLabel]?.includes(searchString.value);
    });
});
const modelName = computed(() => {
    if (model.value?.length === props.options?.length) {
        return 'All';
    } else if (model.value?.length > 2) {
        return `${model.value[0][props.keyLabel]}, ${model.value[1][props.keyLabel]} + ${model.value.length - 2} more`;
    } else {
        return model.value?.map(item => item[props.keyLabel]).join(', ');
    }
});
const allSelected = computed({
    get() {
        return selectedOptions.value.length === props.options?.length;
    },
    set(value) {
        selectedOptions.value = value ? props.options : [];
    }
})

watch(() => selectedOptions.value, (value) => {
    if (value.length === props.options.length) {
        checkboxAll.value.indeterminate = false;
    } else if (value.length > 0 && value.length < filteredOptions.value.length) {
        checkboxAll.value.indeterminate = true;
    } else {
        checkboxAll.value.indeterminate = false;
    }
});

function confirm() {
    if (selectedOptions.value.length === props.options.length) {
        model.value = undefined;
    } else {
        model.value = selectedOptions.value;
    }
    dropdownOpen.value = false;
}

function toggleAllOptions() {
    if (checkboxAll.value.checked) {
        selectedOptions.value = filteredOptions.value;
    } else {
        selectedOptions.value = [];
    }
}
async function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value;
    await nextTick();

    if (!model.value) {
        selectedOptions.value = props.options;
    }
}

</script>
<template>
    <div class="w-full h-full">
        <select name="" id="" multiple class="xl:hidden" v-model="model">
            <option v-for="(option, index) in options" :value="option" :key="index">
                {{ option[keyLabel] }}
            </option>
        </select>
        <div class="relative w-full h-full hidden xl:block">
            <div class="w-full h-full input min-h-[34px] cursor-pointer truncate whitespace-nowrap"
                @click="toggleDropdown">
                {{ modelName }}
            </div>
            <div v-show="dropdownOpen"
                class="absolute top-9 left-0 transition-all z-10 bg-slate-800 p-4 rounded-lg flex flex-col gap-2">
                <input type="search" placeholder="Search"
                    class="w-full p-2 border border-gray-300 rounded-md text-black" v-model="searchString">
                <label class="flex w-full cursor-pointer items-center gap-2 text-sm py-1.5" @click="toggleAllOptions">
                    <input ref="checkboxAll" type="checkbox" style="outline: none" class="checkbox" :value="undefined"
                        v-model="allSelected">
                    <div class="inline-block w-[calc(100%_-_24px)] truncate text-start text-sm text-white" title="All">
                        All
                    </div>
                </label>
                <label v-for="(option, index) in filteredOptions" :key="index"
                    class="flex w-full cursor-pointer items-center gap-2 text-sm py-1.5">
                    <input v-model="selectedOptions" type="checkbox" style="outline: none" class="checkbox"
                        :value="option">
                    <div class="inline-block w-[calc(100%_-_24px)] truncate text-start text-sm text-white"
                        :title="option[keyLabel]">
                        {{ option[keyLabel] }}
                    </div>
                </label>
                <button class="p-2 rounded-lg border hover:bg-slate-700" @click="confirm">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>