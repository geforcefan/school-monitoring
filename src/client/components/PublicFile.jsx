import React from 'react';
import PropTypes from 'prop-types';

import './PublicFile.less'

import { Segment, Image } from 'semantic-ui-react';

const PublicFile = ({ src }) => {
    return <Segment basic className="public-file"><Image src={ `public/${src}` }/></Segment>;
};

PublicFile.propTypes = {
    src: PropTypes.string
};

export default PublicFile;