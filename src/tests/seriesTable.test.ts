// SeriesTable.spec.ts
import { mount, shallowMount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import {
  vi,
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  beforeAll,
  afterAll,
} from 'vitest';
import SeriesTable from '../views/SeriesTable.vue';
import TablePaginator from '../components/TablePaginator.vue';
import tableNav from '../directives/TableArrowNav';
import { useSeries } from '../composables/series';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'series',
  }),
}));
vi.mock('../composables/series', () => ({
  useSeries: () => ({
    seriesDialog: ref(null),
    seria: ref(null),
    series: ref([
      { id: 1, name: 'Series 1', url: 'https://example.com/1' },
      { id: 2, name: 'Series 2', url: 'https://example.com/2' },
      { id: 3, name: 'Series 3', url: 'https://example.com/3' },
    ]),
    seriesMeta: ref({ pageCount: 2, page: 1, perPage: 1, total: 2 }),
    querySeries: ref({
      perPage: 20,
      page: 1,
      sort: ['-id'],
    }),
    getSeries: vi.fn(),
    changeSort: vi.fn(),
    openSeriesDialog: vi.fn(),
    updateSeries: vi.fn(),
    closeDialog: vi.fn(),
  }),
}));

beforeAll(() => {
  // create teleport target
  const el = document.createElement('div');
  el.id = 'menu-target';
  // console.log({ 'document.body': document.body });
  document.body.appendChild(el);
});

afterAll(() => {
  // clean up
  document.body.outerHTML = '';
});

describe('SeriesTable', () => {
  test('renders the series correctly', async () => {
    const wrapper = mount(SeriesTable, {
      global: {
        directives: {
          'table-nav': tableNav,
        },
      },
    });
    await nextTick(); // wait for DOM update after the getSeries call

    const rows = wrapper.findAll('tbody > tr');
    expect(rows.length).toBe(3);

    expect(rows[0].text()).toContain('1');
    expect(rows[0].text()).toContain('Series 1');

    expect(rows[1].text()).toContain('2');
    expect(rows[1].text()).toContain('Series 2');

    expect(rows[2].text()).toContain('3');
    expect(rows[2].text()).toContain('Series 3');
  });

  test('opens the dialog when Create Series button is clicked', async () => {
    const wrapper = mount(SeriesTable, {
      global: {
        directives: {
          'table-nav': tableNav,
        },
      },
    });
    
    const targetElement = document.getElementById('menu-target');
    const btnElement = targetElement?.querySelector(
      '.btn-header-green'
    ) as HTMLButtonElement;
    btnElement.click();
    await nextTick();
    expect(wrapper.find('dialog').isVisible()).toBe(true);
  });

  test('changes the page when TablePaginator emits update-page', async () => {
    const wrapper = mount(SeriesTable, {
      global: {
        directives: {
          'table-nav': tableNav,
        },
      },
    });
    await nextTick();

    wrapper.findComponent(TablePaginator).vm.$emit('update-page', 2);

    await nextTick();
    expect(wrapper.vm.querySeries.page).toBe(2);
  });
});
