import * as React from "react";
import * as ReactDOM from "react-dom";
import { StatelessComponent } from "react";
import { CSSTransition, CSSTransitionProps, transit } from "react-css-transition";

import { Demo, Logo, SyntaxHighlighter, Button, Quote } from "./components";

import {
  IntroExample,
  InlineExample, inlineExampleSource,
  ClassExample, classExampleSource,
  CompletionExample, completionExampleSource,
  AppearExample, appearExampleSource,
  GroupExample, groupExampleSource,
  InitExample, initExampleSource,
} from "./examples";

import {
  baseStyleInlineSnippet,
  baseStyleClassSnippet,
  triggerLeaveSnippet,
  triggerEnterSnippet,
  transitionAppearSnippet,
  onTransitionCompleteSnippet,
  inlineStyleSnippet,
  initStyleSnippet,
  groupTreeSnippet,
  groupTranistionSnippet,
  groupSnippet,
  groupExampleSnippet,
  cssSnippet,
  componentSnippet,
  introSnippet,
  delaySnippet,
  delayObjectSnippet,
} from "./snippets";

import classes from "./app.css";

require("./global.css"); /* tslint:disable-line: no-var-requires */

const fadeIn: CSSTransitionProps = {
  defaultStyle: {
    opacity: 0,
    transform: "translateY(10px)",
  },
  enterStyle: {
    opacity: transit(1.0, 500, "ease-in-out", 300),
    transform: transit("translateY(0px)", 500, "ease-in-out", 300),
  },
  activeStyle: {
    opacity: 1.0,
    transform: "translateY(0px)",
  },
};

const codePenURL = "http://codepen.io/wikiwi/pen/MJQWYY?editors=0010";
const newSpecURL = "https://drafts.csswg.org/css-transitions-2/#dom-transitionevent-transitionstart";
const githubURL = "https://github.com/wikiwi/react-css-transition";
const cssTransitionIssuePostURL = "https://www.smashingmagazine.com/2013/04/css3-transitions-thank-god-specification/";
const getComputedStyleURL = "https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle";
const reactTransitionAddonURL = "https://facebook.github.io/react/docs/animation.html";

const quoteURLBlinkDev = "https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/8s2fxAhqR4M";
const quoteURLYComb = "https://news.ycombinator.com/item?id=5186702";
const quoteGaearon = "https://github.com/facebook/react/issues/5914#issuecomment-228616321";

const App: StatelessComponent<void> = () => (
  <div className={classes.root}>
    <header className={classes.hero}>
      <CSSTransition {...fadeIn} transitionAppear active>
        <div className={classes.logoContainer}>
          <div className={classes.logoContainerFlex}>
            <Logo className={classes.logo} /> <h1 className={classes.logoText}>React CSS Transition</h1>
          </div>
          <p className={classes.logoSubtext}>Take Control of Your CSS Transitions</p>
          <p className={classes.githubButton}>
            <Button href={githubURL}>Github</ Button>
          </p>
        </div>
      </CSSTransition>
    </header>

    <main className={classes.main}>
      <section className={classes.mainSection}>
        <h2>Why we need this</h2>
        <p>
          CSS transitions are known for its <a href={cssTransitionIssuePostURL}>problems and unreliability</a>.
          Until browsers implement the new <a href={newSpecURL}>CSS Specification Draft</a> there is no
          easy way to detect the start and the end of a transition. This is most problematic when we
          want to reverse a potentially started transition or run a callback as soon as the transition ends.
        </p>
        <p>
          React CSS Transition handles the issues for you and gives you a reliable API to transition between
          two states that works across browsers.
        </p>
        <div className={classes.block}>
          <Quote source="User on Blink Dev Group" url={quoteURLBlinkDev}>
            CSS transitions suck - Please implement transitionstart event
          </Quote>
          <Quote source="User on YCombinator" url={quoteURLYComb}>
            CSS transitions are just total shit to deal with in javascript.
          </Quote>
        </div>
        <section className={classes.mainSection}>
          <h3>What About the Official <a href={reactTransitionAddonURL}>ReactCSSTransitionGroup</a></h3>
          <p>
            The official addon doesn't tackle the underlying issue, but just works around them using timeouts.
            There is a list of long standing issues and Facebook plans to deprecate the addon in favor of
            community driven projects.
          </p>
          <Quote source="React Core Team Member on Github" url={quoteGaearon}>
            We haven’t done a good job at maintaining TransitionGroup because it isn’t actively used inside
            Facebook. [...] We plan to hand it over to the community eventually because we just don’t have
            a strong enough use case for it, and we don’t have the capacity to review issues and pull requests
            related to it unless they are trivial. Thanks for understanding!
          </Quote>
        </section>
      </section>

      <section className={classes.mainSection}>
        <h2>Installation</h2>

        <SyntaxHighlighter language="bash">
          npm install --save react-css-transition
        </SyntaxHighlighter>
      </section>

      <section className={classes.mainSection}>
        <h2>Usage</h2>

        <section className={classes.mainSection}>
          <h3>How It Looks Like</h3>
          <IntroExample />
          <SyntaxHighlighter language="javascript">
            {introSnippet}
          </SyntaxHighlighter>
          <p>
            <a href={codePenURL}>Go to CodePen example</a>
          </p>
        </section>

        <section className={classes.mainSection}>
          <h3>The Different Stages of the Transition</h3>
          <p>
            In React CSS Transition components transition between the <em>default</em> state and
            the <em>active</em> state. The stages of the transition looks like this:
          </p>
          <code>
            {"default --> enterInit --> enter --> active"}<br />
            {"default <-- leave <-- leaveInit <-- active"}
          </code>
          <p>
            The init stages are optional and are rendered shortly before the actual transition to allow the
            application of initial style values.
          </p>
          <p>
            When a triggered transition is interrupted React CSS Transition will detect whether the transition has
            already started and if so will trigger a reverse transition:
          </p>
          <code>
            {"default --> enterInit --> enter --> leave -> default "}
          </code>
        </section>

        <section className={classes.mainSection}>
          <h3>Triggering a transition</h3>
          <p>
            In order to transition to the active state, you set <code>active=true</code>:
          </p>
          <SyntaxHighlighter language="javascript">
            {triggerEnterSnippet}
          </SyntaxHighlighter>
          <p>
            To transition to the default state, you set <code>active=false</code>:
          </p>
          <SyntaxHighlighter language="javascript">
            {triggerLeaveSnippet}
          </SyntaxHighlighter>
        </section>

        <section className={classes.mainSection}>
          <h3>Defining Transitions Using Inline Styles</h3>
          <p>
            Transitions can be defined using inline styles. The provided styles must be already prefixed
            if you want to support legacy browsers. React CSS Transition contains the
            helper <code>transit(value, duration, timingFunction, delay)</code> which makes defining
            transitions easy. Both <code>duration</code> and <code>delay</code> accepts a numeric value
            in milliseconds.
         </p>
          <SyntaxHighlighter language="javascript">
            {inlineStyleSnippet}
          </SyntaxHighlighter>
          <div className={classes.block}>
            <Demo title="Inline Styles Example" component={InlineExample} source={inlineExampleSource} />
          </div>
        </section>

        <section className={classes.mainSection}>
          <h3>Defining Transitions Using CSS Classes</h3>
          <p>
            React CSS Transition supports defining transitions using CSS classes.
            Internally we use <a href={getComputedStyleURL}>getComputedStyle()</a> to extract the transitions
            from the CSS classes automatically. It also means that this can cause a reflow and thus is
            a little less performant than using the inline styles variant.
          </p>
          <SyntaxHighlighter language="javascript">
            {cssSnippet}
          </SyntaxHighlighter>
          <div className={classes.block}>
            <Demo title="CSS Classes Example" component={ClassExample} source={classExampleSource} />
          </div>
        </section>

        <section className={classes.mainSection}>
          <h3>Using Base Styles</h3>
          <p>
            Base styles defined by the <code>style</code> and respectively the <code>className</code> property
            are always applied to the component.
          </p>
          <SyntaxHighlighter language="javascript">
            {baseStyleInlineSnippet}
          </SyntaxHighlighter>
          <SyntaxHighlighter language="javascript">
            {baseStyleClassSnippet}
          </SyntaxHighlighter>
        </section>

        <section className={classes.mainSection}>
          <h3>Applying Initial Styles Before the Transition</h3>
          <p>
            The transition can be initialized using the <code>enterInitStyle</code>, <code>leaveInitStyle</code> and
            respectively the <code>enterInitClassName</code>, <code>leaveInitClassName</code> property. These
            styles are applied at least one frame before the actual transition.
          </p>
          <p>
            In the following example the <code>transform</code> style is only applied during the transition and
            then returns to absolute positioning:
          </p>
          <SyntaxHighlighter language="javascript">
            {initStyleSnippet}
          </SyntaxHighlighter>
          <div className={classes.block}>
            <Demo title="Transition Init Example" component={InitExample} source={initExampleSource} />
          </div>
        </section>

        <section className={classes.mainSection}>
          <h3>Additional Transition Delay</h3>
          <p>
            <em>
              * Support is currently limited to inline styles defined using the <code>transit</code> helper.
                This limitation will be removed in a coming release.
            </em>
          </p>
          <p>
            An additional amount of delay in milliseconds can be added to the transitions using
            the <code>transitionDelay</code> property. A numeric value will be applied
            to both the entering and leaving transition.
          </p>
          <SyntaxHighlighter language="javascript">
            {delaySnippet}
          </SyntaxHighlighter>
          <p>
            You can also specify a separate delay for each transition.
          </p>
          <SyntaxHighlighter language="javascript">
            {delayObjectSnippet}
          </SyntaxHighlighter>
        </section>

        <section className={classes.mainSection}>
          <h3>The Completion Event</h3>
          <p>
            React CSS Transition allows you to attach a callback using the <code>onTransitionComplete</code> property,
            which is called whenever a transition was triggered and either
            the <em>default</em> or <em>active state</em> has been reached. You don't have to worry about whether a
            transition has actually started or not as this is handled internally by React CSS Transition.
          </p>
          <SyntaxHighlighter language="javascript">
            {onTransitionCompleteSnippet}
          </SyntaxHighlighter>
          <div className={classes.block}>
            <Demo
              title="Completion Example"
              component={CompletionExample}
              source={completionExampleSource}
              />
          </div>
        </section>

        <section className={classes.mainSection}>
          <h3>Perform Transition Upon Mount</h3>
          <p>
            A component can be mounted initially in the <em>active state</em>, in this case no transition will
            take place. If you want to perform a transition from the <em>default</em> to
            the <em>active state</em> upon mount, you can enable the <code>transitionAppear</code> flag.
          </p>
          <SyntaxHighlighter language="javascript">
            {transitionAppearSnippet}
          </SyntaxHighlighter>
          <div className={classes.block}>
            <Demo title="Appear Example" component={AppearExample} source={appearExampleSource} />
          </div>
        </section>

        <section className={classes.mainSection}>
          <h3>The CSS Transition Group</h3>
          <p>
            React CSS Transition exports another component called <code>CSSTransitionGroup</code> that you can
            use to perform a transition whenever a child component leaves or enters the
            DOM. <code>CSSTransitionGroup</code> passes the
            properties <code>active</code> and <code>transitionAppear</code> to its children
            and uses the <code>onTransitionComplete</code> property to track the
            transition. This means that the child components must all be wrapped with
            the <code>CSSTransition</code> component or handle the above properties
            themselves.
          </p>
          <p>
            The resulting tree should look something like this:
          </p>
          <SyntaxHighlighter language="bash">
            {groupTreeSnippet}
          </SyntaxHighlighter>
          <p>
            Let's predefine a <code>CSSTransition</code>:
          </p>
          <SyntaxHighlighter language="javascript">
            {groupTranistionSnippet}
          </SyntaxHighlighter>
          <p>
            Then create a component that fades in and out its children:
          </p>
          <SyntaxHighlighter language="javascript">
            {groupSnippet}
          </SyntaxHighlighter>
          <p>
            Finally we put it into use:
          </p>
          <SyntaxHighlighter language="javascript">
            {groupExampleSnippet}
          </SyntaxHighlighter>
          <div className={classes.block}>
            <Demo title="Transition Group Example" component={GroupExample} source={groupExampleSource} />
          </div>

          <section className={classes.mainSection}>
            <h4>Appear on Initial Mount</h4>
            <p>
              If you mount the <code>CSSTransitionGroup</code> together with some children at the same time,
              no transition will be triggered unless you set <code>transitionAppear=true</code> on
              the <code>CSSTransitionGroup</code>.
            </p>
            <SyntaxHighlighter language="javascript">
              {transitionAppearSnippet}
            </SyntaxHighlighter>
          </section>
        </section>

        <section className={classes.mainSection}>
          <h3>Rendering a Different Component</h3>
          <p>
            Both <code>CSSTransition</code> and <code>CSSTransitionGroup</code> renders as a <code>div</code> component
            per default. You can change this to any other component using the <code>component</code> property including
            ones you've written yourself! Any unknown props will be passed down to the specified component.
          </p>
          <SyntaxHighlighter language="javascript">
            {componentSnippet}
          </SyntaxHighlighter>
        </section>
      </section>
    </main>
  </div >
);

ReactDOM.render(<App />, document.getElementById("app"));
