import React, { Suspense, useContext } from 'react';
import fetchResource from 'fetch-suspense';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SettingsContext } from './SettingsContext';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
    card: {
        background: "rgba(255, 255, 255, 0.7)",
        pointerEvents: 'auto',
        margin: 40
    },
    cardHeader: {
        paddingBottom: 0
    }
});

const MapCacheList = () => {
    const cache = fetchResource('https://nodecraft.cloud.zihao.me/mapcache')
    return (
        <List>
            {cache.reverse().map(({ tag, data }, i) => {
                return <ListItem key={i} button onClick={() => {
                    window.craft.clearBlocks();
                    for (const pos of Object.keys(data)) {
                        window.craft.insertBlock(pos.split(',').map(Number), data[pos]);
                    }
                }}>
                    <ListItemText primary={`World #${i}: ${tag}`} />
                </ListItem>
            })}
        </List>
    )
}

const HistoryCard = (props) => {
    const { classes } = props;
    const settings = useContext(SettingsContext);

    return (settings.showHistory &&
        <Card className={classes.card}>
            <CardHeader
                className={classes.cardHeader}
                title="Block History"
                subheader="restore block world to an old version"
                action={
                    <IconButton
                        className={classes.button} color="secondary" aria-label="Close"
                        onClick={() => settings.set({ showHistory: false })}
                    >
                        <CloseIcon />
                    </IconButton>
                }
            />
            <Suspense fallback={<CircularProgress />}>
                <MapCacheList />
            </Suspense>
        </Card>
    );
}

HistoryCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HistoryCard);