import React from 'react';
import PropTypes from 'prop-types';

export const provideShuffle = InnerComponent => (class Shuffler extends React.Component {
    shuffleHandler = null;

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

        this.shuffleHandler = window.setInterval(this.onShuffle, this.props.shuffleDuration);
    }

    onShuffle() {
        this.setState({ amountOfCycles: this.state.amountOfCycles + 1 });
    }

    clearEvents() {
        window.clearInterval(this.shuffleHandler);
    }

    componentWillUnmount() {
        this.clearEvents();
    }

    render() {
        return <InnerComponent {...this.props} {...this.state}/>;
    }
});