import { describe, afterAll, afterEach, beforeAll, expect, test, beforeEach, vi } from "vitest"
import { shallowMount, mount } from '@vue/test-utils';
import TagTable from "../views/TagTable.vue"
import {handlers} from '../mocks/handlers'
import { setupServer } from 'msw/node'
import { nextTick } from "vue";
import tableNav from '../directives/TableArrowNav';

vi.mock('../composables/tags', () => ({
  useTag: () => ({
    tags: [
      { id: 1, name: 'Tag 1' },
      { id: 2, name: 'Tag 2' },
      { id: 3, name: 'Tag 3' }
    ],
    getTags: vi.fn()
  })
}));

describe('TagTable', () => {
  test('renders the tags correctly', async () => {
    const wrapper = mount(TagTable, {
      global: {
        directives: {
          'table-nav': tableNav,
        },
      },
    });
    await nextTick(); // wait for DOM update after the getTags call
    
    const rows = wrapper.findAll('tbody > tr');
    expect(rows.length).toBe(3);

    expect(rows[0].text()).toContain('1');
    expect(rows[0].text()).toContain('Tag 1');

    expect(rows[1].text()).toContain('2');
    expect(rows[1].text()).toContain('Tag 2');

    expect(rows[2].text()).toContain('3');
    expect(rows[2].text()).toContain('Tag 3');
  });
});
/* const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

beforeEach(() => {
  location.replace(`http://localhost`);    
}) */
// Mocking the composable that is used in the component


/* describe('TagComponent', () => {
  sessionStorage.setItem('lib-token', 'test_token');
    test('displays the correct tags', async () => {
      const wrapper = mount(TagTable)
  
      // This waits until Vue has finished updating the DOM
      await wrapper.vm.$nextTick()

      const rows = wrapper.findAll('tbody > tr')
      expect(rows.length).toBe(2) // Assuming you have 2 tags
  
      const firstRow = rows[0]
      expect(firstRow.text()).toContain('1')
      expect(firstRow.text()).toContain('tag1')
  
      const secondRow = rows[1]
      expect(secondRow.text()).toContain('2')
      expect(secondRow.text()).toContain('tag2')
    })
  }) */