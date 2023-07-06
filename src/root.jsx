// @refresh reload
import {Suspense, createSignal, For, children, createEffect} from "solid-js";
import {A, Body, ErrorBoundary, Head, Html, Meta, Scripts, Title, Link} from "solid-start";

import "./root.sass";

const [hsl, set_hsl] = createSignal({
  hue: 0,
  saturation: 100,
  lightness: 75,
  opacity: 100
});
const color = values => `hsl(${values.hue} ${values.saturation}% ${values.lightness}% / ${values.opacity}%)`;
const other_values = (type, value) => ({...hsl(), [type]: value});
const background_gradient = type => `linear-gradient(to right, ${color(other_values(type, 0))}, ${color(other_values(type, 100))})`;
const full_gradient = () => `linear-gradient(to right, ${[...Array(36).keys()].map(value => `${color({...hsl(), hue: value * 10})} ${Math.floor(value / 36 * 100)}%`).join(", ")})`;

const Picker = (props) => {
  const set_value = event => set_hsl(value => ({...value, [props.type]: Math.min(+event.target.value, props.max ?? 100)}));
  return (
    <div>
      <label for={props.type}>{props.type.charAt(0).toUpperCase() + props.type.slice(1)}</label>
      <input id={`${props.type}_range`} type="range" min="0" max={props.max ?? 100} value={hsl()[props.type]} on:input={set_value} style={{"background-image": props.max ? full_gradient() : background_gradient(props.type)}} tabindex="-1"/>
      <input id={props.type} type="number" min="0" max={props.max ?? 100} value={hsl()[props.type]} on:input={set_value} maxlength="3"/>
    </div>
  );
};

const Display = (props) => {
  const kids = children(() => props.children);
  createEffect(() => kids().forEach(child => child.style.background = color(hsl())));
  return <article>{kids()}</article>;
};

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>HSL</Title>
        <Meta charset="utf-8"/>
        <Meta name="viewport" content="width=device-width, initial-scale=1"/>
        <Link rel="icon" href="favicon.svg"/>
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <main>
              <h1 style={{background: color(hsl())}}>HSL</h1>
              <section>
                <Picker type="hue" max={360}/>
                <Picker type="saturation"/>
                <Picker type="lightness"/>
                <Picker type="opacity"/>
              </section>
              <section>
                <Display>
                  <button style="color: black">Button</button>
                  <button style="color: white">Button</button>
                  <input placeholder="placeholder"/>
                  <input type="submit"/>
                </Display>
              </section>
            </main>
          </ErrorBoundary>
        </Suspense>
        <Scripts/>
      </Body>
    </Html>
  );
}
