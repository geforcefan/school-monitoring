import React from 'react';
import PropTypes from 'prop-types';

import { Segment } from 'semantic-ui-react';

import { provideShuffle } from '../provider/Shuffler';

import PublicFile from '../components/PublicFile';

import config from '../../../config.json';

const multiIncludes = (str, collection) => !!collection.map(item => str.includes(item)).filter(item => item).length;

class Files extends React.Component {
    static propTypes = {
        directory: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            error: false
        };

        fetch(`http://${config.client.host}:${config.client.port}/api/files/${this.props.directory}`)
            .then(res => res.json())
            .then(files => files.filter(file => multiIncludes(file.toLowerCase(), ['jpg', 'jpeg', 'png'])))
            .then(files => {
                this.setState({
                    data: files,
                    error: null
                })
            })
            .catch(err => this.setState({ error: err }));
    }

    render() {
        const currentIndex = this.props.amountOfCycles % this.state.data.length;

        return <Segment basic className="full-height">
            { this.state.error && <div>Es ist ein Fehler aufgetreten</div>}

            { !!this.state.data.length && <PublicFile src={ this.state.data[currentIndex] }/> }
        </Segment>
    }
}

export default provideShuffle(Files);