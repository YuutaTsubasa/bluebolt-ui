// Skins showcase: the same components under every skin, plus a site-style page.
import 'bluebolt-ui/styles.css';
import './fusion.css';
import { mount } from 'svelte';
import Skins from './Skins.svelte';

mount(Skins, { target: document.getElementById('app') });
