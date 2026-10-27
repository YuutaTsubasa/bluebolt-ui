// The demo imports the library through its package name, exactly like a consumer would.
import 'bluebolt-ui/styles.css';
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.getElementById('app') });
