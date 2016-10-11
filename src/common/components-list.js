import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch
} from 'react-native'
import Dimensions from 'Dimensions'

class ComponentsList extends Component {
  constructor(props) {
    super(props)
  }

  _renderRow(component) {
    const { name, active } = component
    return (
      <View key={name} style={styles.row}>
          <Text style={styles.text}>{name}</Text>
          <Switch style={styles.switch}
          value={active}
          onChange={() => this.props.toggleComponent(component)}
          />
      </View>
    )
  }

  render() {
    return (
      <View style={this.props.app === 'ios' ? styles.iosScrollView : styles.androidScrollView}>
        <ScrollView>
          {this.props.components.map((component) => this._renderRow(component))}
        </ScrollView>
      </View>
    )
  }
}

export default ComponentsList

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  iosScrollView: {
    // marginTop: 100
  },
  androidScrollView: {
    marginTop: 0,
  },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#d7d7d7',
  },
  text: {
    padding: 10,
    fontSize: 18
  },
  switch: {
    padding: 10
  }
})
