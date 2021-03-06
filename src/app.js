import React, { Component } from 'react'
import {
  AppRegistry,
  NetInfo,
  AsyncStorage,
  View
} from 'react-native'
import Layout from './layout'
import Setup from './common/setup'
import Loading from './common/loading'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      connection: false,
      ip: null,
      loading: false,
      error: false
    }
  }

  componentDidMount() {
    NetInfo.addEventListener('change', this.handleNetworkChange.bind(this))
    this.readIpFromStorage()
  }

  readIpFromStorage() {
    AsyncStorage.getItem('ip')
      .then((ip) => {
        if (ip) {
          this.setState({ ip })
          if (this.state.connection === 'wifi' || this.state.connection === 'WIFI') {
            this.connectToMirror(ip)
          }
        } else {
          this.setState({ ip: null })
        }
      })
      .catch((err) => {
        this.setState({ ip: null })
        AsyncStorage.setItem('ip', '')
      })
  }

  handleNetworkChange(reach) {
    this.setState({ connection: reach })
    if (reach === 'wifi' || reach === 'WIFI' && this.state.ip) {
      this.connectToMirror(this.state.ip)
    }
  }

  connectToMirror(ip) {
    if (ip && this.state.connection === 'wifi' || this.state.connection === 'WIFI') {
      this.setState({ loading: true, error: false })
      const url = `http://${ip}:5000/components`
      fetch(url)
        .then((res) => res.json())
        .then((components) => {
          if (components && components.length) {
            AsyncStorage.setItem('ip', ip)
            this.setState( { ip, components, loading: false })
          } else {
            this.setState({ ip: null, error: true, loading: false })
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
            error: true,
            ip: null
          })
        })
    }

  }

  toggleComponent(toggledComp) {
    const newComponents = this.state.components.map((component) => {
      return component.name === toggledComp.name
        ? Object.assign({}, toggledComp, {active: !component.active})
        : component
    })

    fetch(`http://${this.state.ip}:5000/components`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        components: newComponents
        })
      })
    .then(() => this.setState({components: newComponents}))
    .catch((err) => {
      this.setState({error: true})
    })
  }

  resetIp() {
    this.setState({loading: false})
    AsyncStorage.setItem('ip', '')
  }

  render() {
    return (
      <View>
        {
          this.state.components
          ? <Layout
              components={this.state.components}
              toggleComponent={this.toggleComponent.bind(this)}
              {...this.props}/>
          : <Setup
              loading={this.state.loading}
              connection={this.state.connection}
              connectToMirror={this.connectToMirror.bind(this)}
              resetIp={this.resetIp.bind(this)}
              error={this.state.error}
              {...this.props}/>
        }
      </View>
    );
  }
}

export default App
