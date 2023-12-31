import { shallowMount, mount } from '@vue/test-utils';
import LoginPage from '../views/LoginPage.vue';
import { test, expect } from 'vitest';

test('should render the login form', () => {
  const wrapper = shallowMount(LoginPage);
  expect(wrapper.find('#login-username').exists()).toBe(true);
  expect(wrapper.find('#login-pass').exists()).toBe(true);
  expect(wrapper.find('button.login-btn').exists()).toBe(true);
});

