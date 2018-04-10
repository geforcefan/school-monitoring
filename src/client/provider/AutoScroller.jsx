import React from 'react';
import PropTypes from 'prop-types';

import './AutoScroller.less';

export const provideAutoScroller = InnerComponent => (class AutoScroller extends React.Component {
    element = null;

    containerHeight = null;
    contentHeight = null;
    shouldScroll = false;

    shuffleHandler = null;
    direction = "bottom";

    static propTypes = {
        shuffleDuration: PropTypes.number
    };

    static defaultProps = {
        shuffleDuration: 2000
    };

    constructor(props) {
        super(props);

        this.onShuffle = this.onShuffle.bind(this);

        this.state = {
            amountOfCycles: 0
        };
    }

    setReference(element) {
        this.clearEvents();

        if(!element)
            return;

        this.element = element;
        this.init();
    }

    init() {
        this.shuffleHandler = window.setInterval(this.onShuffle, this.props.shuffleDuration);
    }

    onShuffle() {
        this.containerHeight = this.element.clientHeight;
        this.contentHeight = this.element.querySelector(".content").clientHeight;

        this.shouldScroll = this.containerHeight - this.contentHeight < 0;

        if(this.direction === "bottom")
            this.element.scrollTop += this.containerHeight;
        else
            this.element.scrollTop -= this.containerHeight;

        if(this.direction === "bottom" && this.element.scrollTop + this.containerHeight >= this.contentHeight)
            this.direction = "top";

        if(this.direction === "top" && this.element.scrollTop <= 0) {
            this.direction = "bottom";
            this.onShuffleFinished();
        }
    }

    onShuffleFinished() {
        this.setState({ amountOfCycles: this.state.amountOfCycles + 1 });
    }

    clearEvents() {
        window.clearInterval(this.shuffleHandler);
    }

    componentWillUnmount() {
        this.clearEvents();
    }

    render() {
        console.log("Update");
        return <div className="auto-scroller" ref={ element => this.setReference(element) }>
            <div className="content">
                <InnerComponent {...this.props} {...this.state}/>
            </div>
        </div>;
    }
});