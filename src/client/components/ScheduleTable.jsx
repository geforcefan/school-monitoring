import React from 'react';
import PropTypes from 'prop-types';

import humanize from 'humanize';
import moment from 'moment';

import { Table, Header } from 'semantic-ui-react';

const ScheduleTable = ({ data }) => {
    return <div>
        <Header as="h1" icon="calendar" subheader={ humanize.date("d.m.Y", moment(data.timestamp * 1000).toDate()) } content="Vertretungsplan"/>
        <Table celled striped>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Klasse</Table.HeaderCell>
                <Table.HeaderCell>Fach</Table.HeaderCell>
                <Table.HeaderCell>Stunde</Table.HeaderCell>
                <Table.HeaderCell>Vertretung</Table.HeaderCell>
                <Table.HeaderCell>Fach</Table.HeaderCell>
                <Table.HeaderCell>Raum</Table.HeaderCell>
                <Table.HeaderCell>Kommentar</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
            { data.schedule.map((point, i) =>
                <Table.Row key={ i }>
                    <Table.Cell>{ point.grade }</Table.Cell>
                    <Table.Cell>{ point.name }</Table.Cell>
                    <Table.Cell>{ point.period }</Table.Cell>
                    <Table.Cell>{ point.substitute }</Table.Cell>
                    <Table.Cell>{ point.subject }</Table.Cell>
                    <Table.Cell>{ point.room }</Table.Cell>
                    <Table.Cell>{ point.comment }</Table.Cell>
                </Table.Row>
            )}
            </Table.Body>
        </Table>
    </div>;
};

/*ScheduleTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        grade
    }))
}*/

export default ScheduleTable;