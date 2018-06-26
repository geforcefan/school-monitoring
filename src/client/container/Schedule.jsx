import React from 'react';

import { Segment } from 'semantic-ui-react';

import { provideAutoScroller } from '../provider/AutoScroller';

import ScheduleTable from '../components/ScheduleTable';

import config from '../../../config.json';

class Schedule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            error: false
        };

        fetch(`http://${config.server.host}:${config.server.port}/api/schedule/data`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    data,
                    error: null
                })
            })
            .catch(err => this.setState({ error: err }));
    }

    render() {
        const currentIndex = this.props.amountOfCycles % this.state.data.length;

        return <Segment basic>
            { this.state.error && <div>Es ist ein Fehler aufgetreten</div>}

            { this.state.data[currentIndex] && <ScheduleTable data={ this.state.data[currentIndex] } /> }
        </Segment>
    }
}

export default provideAutoScroller(Schedule);