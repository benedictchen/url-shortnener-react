import React from 'react';
import { act } from "react-dom/test-utils";
import {App, ACCESS_TOKEN, GB_API_ENDPOINT} from './App';
import waitUntil from 'async-wait-until';
import { shallow, mount, render } from 'enzyme';

const LIST_DUMMY_RESPONSE = [
	{"url":"test.com","slug":"Pon","short_url":"http://bely.me/Pon"},
	{"url":"www.twitter.com","slug":"QpY","short_url":"http://bely.me/QpY"},
	{"url":"www.benedictchen.com","slug":"RqR","short_url":"http://bely.me/RqR"},
];


describe('App', () => {

	beforeEach(() => {
		 fetch.resetMocks();
	});

	it('should display no urls if none exist', async () => {
		fetch.mockResponseOnce(JSON.stringify([]));
		const wrapper = mount(<App />);
		let input = null;
		input = wrapper.find('input');
		await waitUntil(() => {
			wrapper.update();
			input = wrapper.find('input');
			return input.exists();
		});
		expect(wrapper.find('li').exists()).toBe(false);
		fetch.mockResponseOnce(JSON.stringify(LIST_DUMMY_RESPONSE));
	});

	it('should display list elements if they exist', async () => {
		fetch.mockResponseOnce(JSON.stringify(LIST_DUMMY_RESPONSE));
		const wrapper = mount(<App />);
		let input = null;
		input = wrapper.find('input');
		await waitUntil(() => {
			wrapper.update();
			input = wrapper.find('input');
			return input.exists();
		});
		expect(wrapper.find('li').length).toBe(3);
	});

	it('should send request to create new link', async () => {
		fetch.mockResponse(JSON.stringify([]));
		const wrapper = mount(<App />);
		let input = null;
		input = wrapper.find('input');
		await waitUntil(() => {
			wrapper.update();
			input = wrapper.find('input');
			return input.exists();
		});

		input.simulate('change', { target: { value: 'www.google.com' } });
		const btn = wrapper.find('button');
		btn.simulate('click');
		const post = fetch.mock.calls.find((item) => {
			return item[1].method === 'POST';
		});
		expect(post).toBeTruthy();
		const resultBody = JSON.parse(post[1].body);
		expect(resultBody.url).toEqual('www.google.com');

	});

	it('should delete items if they exist', async () => {
		fetch.mockResponse(JSON.stringify(LIST_DUMMY_RESPONSE));
		const wrapper = mount(<App />);
		let input = null;
		input = wrapper.find('input');
		await waitUntil(() => {
			wrapper.update();
			input = wrapper.find('input');
			return input.exists();
		});
		expect(wrapper.find('li').length).toBe(3);
		const deleteButton = wrapper.find('.delete-button');
		deleteButton.first().simulate('click');
		const callToDelete = fetch.mock.calls.find((item) => {
			return item[1].method === 'DELETE';
		});
		expect(callToDelete).toBeTruthy();
	});
});

