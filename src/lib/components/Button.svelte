<!--
  Skewed plate button with hard shadow, hover sheen and press ripple.
  Renders an <a> when `href` is given.
-->
<script>
  import { ripple } from '../motion/index.js';

  /**
   * @type {{
   *   variant?: 'primary' | 'accent' | 'ink' | 'ghost',
   *   size?: 'sm' | 'md' | 'lg',
   *   href?: string, type?: 'button' | 'submit' | 'reset', disabled?: boolean,
   *   en?: string, children?: import('svelte').Snippet, [key: string]: unknown
   * }}
   */
  let {
    variant = 'primary',
    size = 'md',
    href,
    type = 'button',
    disabled = false,
    en = '',
    children,
    ...rest
  } = $props();
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  class="bb-btn v-{variant} s-{size}"
  href={href && !disabled ? href : undefined}
  type={href ? undefined : type}
  disabled={href ? undefined : disabled}
  aria-disabled={href && disabled ? 'true' : undefined}
  use:ripple
  {...rest}
>
  <span class="plate bb-sheen" data-ripple aria-hidden="true"></span>
  <span class="label">
    {#if en}<span class="en">{en}</span>{/if}
    <span class="main">{@render children?.()}</span>
  </span>
</svelte:element>

<style>
  .bb-btn {
    --_bg: var(--bb-blue);
    --_fg: var(--bb-on-blue);
    --_shadow: var(--bb-panel-ink);
    --_facet: var(--bb-blue-shade); /* diagonal darker facet on the right */
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.7em 1.6em;
    border: 0;
    background: none;
    color: var(--_fg);
    font: inherit;
    font-weight: 800;
    font-size: var(--bb-text-md);
    letter-spacing: 0.04em;
    text-decoration: none;
    cursor: pointer;
    isolation: isolate;
    -webkit-tap-highlight-color: transparent;
  }
  .plate {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(112deg, var(--_bg) 0 72%, var(--_facet, var(--_bg)) 72%);
    transform: skewX(var(--bb-skew));
    box-shadow: 0 0 0 0 var(--_shadow);
    transition:
      transform var(--bb-dur-3) var(--bb-ease),
      box-shadow var(--bb-dur-3) var(--bb-ease),
      background-color var(--bb-dur-2);
  }
  .label {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;
    transition: transform var(--bb-dur-3) var(--bb-ease);
  }
  .en {
    font-family: var(--bb-font-cond);
    font-size: 0.62em;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.8;
  }
  .bb-btn:hover:not(:disabled) .plate,
  .bb-btn:focus-visible .plate {
    transform: skewX(var(--bb-skew)) translate(calc(-4px * var(--bb-motion)), calc(-4px * var(--bb-motion)));
    box-shadow: 5px 5px 0 0 var(--_shadow);
  }
  .bb-btn:hover:not(:disabled) .label,
  .bb-btn:focus-visible .label {
    transform: translate(calc(-4px * var(--bb-motion)), calc(-4px * var(--bb-motion)));
  }
  .bb-btn:active:not(:disabled) .plate {
    transform: skewX(var(--bb-skew));
    box-shadow: 0 0 0 0 var(--_shadow);
    transition-duration: var(--bb-dur-1);
  }
  .bb-btn:active:not(:disabled) .label {
    transform: none;
    transition-duration: var(--bb-dur-1);
  }
  .bb-btn:focus-visible {
    outline: none;
    box-shadow: none;
  }
  .bb-btn:focus-visible .plate {
    outline: 3px solid var(--bb-yellow);
    outline-offset: 3px;
  }

  .v-accent {
    --_facet: var(--_bg);
    --_bg: var(--bb-yellow);
    --_fg: var(--bb-on-yellow);
  }
  .v-ink {
    --_facet: var(--_bg);
    --_bg: var(--bb-panel-ink);
    --_fg: var(--bb-on-ink);
    --_shadow: var(--bb-blue);
  }
  .v-ink .plate {
    /* keeps the plate visible when the page itself is dark */
    border: 1.5px solid var(--bb-line-2);
  }
  .v-ghost {
    --_facet: var(--_bg);
    --_bg: transparent;
    --_fg: var(--bb-ink);
    --_shadow: var(--bb-blue);
  }
  .v-ghost .plate {
    border: 2px solid var(--bb-ink);
  }

  .s-sm { font-size: var(--bb-text-sm); padding: 0.5em 1.2em; }
  .s-lg { font-size: var(--bb-text-lg); padding: 0.8em 2em; }

  .bb-btn:disabled,
  .bb-btn[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.45;
  }
</style>
