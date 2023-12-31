import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { describe, expect, test } from 'vitest';

import tableNav from '../directives/TableArrowNav';

describe('tableNav', () => {
  const wrapper = mount(
    defineComponent({
      template: `
            <table>
              <tr>
                <td>Cell 1</td>
                <td class="123">Cell 2</td>
              </tr>
              <tr>
                <td>Cell 3</td>
                <td>Cell 4</td>
              </tr>
            </table>
          `,
      directives: {
        'table-nav': tableNav,
      },
    })
  );

  test('should handle arrow right key press', async () => {
    const firstCell = wrapper.find('td');
    // const nextSibling = firstCell.element.nextElementSibling as HTMLElement;
    await wrapper.trigger('keydown', { code: 'ArrowRight' });
    await nextTick();
    const nextSibling = wrapper.find('td').element.nextElementSibling as HTMLElement;
    console.log('nextSibling', nextSibling.style.color);
    
    expect(nextSibling.style.backgroundColor).toBe('#50b988');
    expect(nextSibling.style.color).toBe('white');
  });
});
