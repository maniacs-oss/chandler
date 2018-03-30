import moment from 'moment';
import React, {PureComponent} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

import {
  EmptyActivity,
  LastTwoYearsStatistics,
  Navbar,
  YearChart,
} from '@components';
import {I18n} from '@i18n';
import {IActivity, IContact} from '@models';
import {IRouterBackOperation} from '@models/operations';
import {commonStyles} from '@theme';
import {styles} from './Activities.styles';

interface IActivitiesProps {
  back: IRouterBackOperation;
  getActivitiesByContact: () => void;
  contact: IContact;
  activities: IActivity[];
  isFetching: boolean;
}

export class Activities extends PureComponent<IActivitiesProps, {}> {
  public componentWillMount() {
    this.props.getActivitiesByContact();
  }

  public keyExtractor = (item, index) => String(item.id);

  public renderHeader = () => {
    const {isFetching} = this.props;

    if (isFetching) {
      return null;
    }

    return (
      <View style={styles.headerContainer}>
        <LastTwoYearsStatistics
          image={require('@assets/icons/activities.png')}
          title1={I18n.t('common:yearDisplay', {year: 2017})}
          count1={3}
          title2={I18n.t('common:yearDisplay', {year: 2016})}
          count2={6}
        />

        <YearChart />
      </View>
    );
  };

  public renderFooter = () => {
    const {isFetching} = this.props;

    if (!isFetching) {
      return null;
    }

    return (
      <ActivityIndicator style={commonStyles.activityIndicator} size="large" />
    );
  };

  public renderItem = ({item, index}) => {
    const {activities} = this.props;
    const activity = activities[index];

    return (
      <View style={styles.activityContainer}>
        <View style={commonStyles.row}>
          <Text style={styles.textLeft}>{activity.summary}</Text>
          <View style={commonStyles.flex} />
          <Text style={styles.textRight}>
            {moment(activity.date_it_happened).fromNow()}
          </Text>
        </View>
        {activity.description && (
          <Text style={styles.textInfo}>{activity.description}</Text>
        )}
      </View>
    );
  };

  public render() {
    const {
      back,
      activities,
      getActivitiesByContact,
      isFetching,
      contact,
    } = this.props;

    return (
      <View style={commonStyles.flex}>
        <Navbar title={I18n.t('activities:activities')} onBack={back} />
        {isFetching || activities.length ? (
          <FlatList
            data={activities}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onEndReached={getActivitiesByContact}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <EmptyActivity
            image={require('./assets/empty-activities.png')}
            title={I18n.t('activities:emptyTitle', {name: contact.first_name})}
            subtitle={I18n.t('activities:emptySubtitle')}
          />
        )}
      </View>
    );
  }
}
