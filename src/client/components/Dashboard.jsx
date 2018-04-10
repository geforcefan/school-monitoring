import React from 'react';
import { GridColumn, GridRow, Grid } from 'semantic-ui-react';

import Schedule from './../container/Schedule';
import Files from './../container/Files';

import config from '../../../config.json';

const Dashboard = ({ data }) =>
    <Grid className="full-height">
        <GridRow columns={2}>
            <GridColumn width={ 10 }>
                <Schedule shuffleDuration={ config.substitutionSchedule.shuffleDuration * 1000 }/>
            </GridColumn>
            <GridColumn width={ 6 }>
                <Grid className="full-height">
                    <GridRow className="half-height">
                        <GridColumn>
                            <Files directory={ config.filesBoxTop.directory } shuffleDuration={ config.filesBoxTop.shuffleDuration * 1000 }/>
                        </GridColumn>
                    </GridRow>
                    <GridRow className="half-height">
                        <GridColumn>
                            <Files directory={ config.filesBoxBottom.directory } shuffleDuration={ config.filesBoxBottom.shuffleDuration * 1000 }/>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </GridColumn>
        </GridRow>
    </Grid>;

export default Dashboard;