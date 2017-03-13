(function () {
  const React = window.React
  const ReactDOM = window.ReactDOM
  const moment = window.moment
  const axios = window.axios

  const TOKEN = '41c18856748a4f86b1fd8bcd4f3b6d67'

  const Team = React.createClass({
    getInfo (url) {
      if (url.indexOf('http:') > -1) {
        url = url.replace('http:', 'https:')
      }
      axios.get(url, {
        headers: { 'X-Auth-Token': TOKEN }
      }).then(response => {
        const data = response.data
        this.setState({
          crest: data.crestUrl,
          name: data.name
        })
      })
    },

    getInitialState () {
      return {
        crest: '',
        name: ''
      }
    },

    componentWillReceiveProps (nextProps) {
      if (nextProps.url) {
        this.getInfo(nextProps.url)
      }
    },

    render () {
      let crestUrl = this.state.crest
      if (crestUrl.indexOf('http:') > -1) {
        crestUrl = crestUrl.replace('http:', 'https:')
      }
      return (
        <span className='team'>
          {this.props.isHome || this.state.name}
          <img src={crestUrl} />
          {this.props.isHome && this.state.name}
        </span>
      )
    }
  })

  const DateDisplay = ({date}) => {
    const dt = moment(date)
    return (
      <div className='dateDisplay' title={dt.format('LLLL')}>
        {date ? dt.fromNow() : 'loading'}
      </div>
    )
  }

  const LastGameContainer = ({lastGames}) => (
    <div className='lastGames container'>
      <h6>Check out the last games</h6>
      {
          lastGames.map(lastGame => (
            <div className='row' title={moment(lastGame.date).format('LLLL')}>
              <div className='four columns'><b>{lastGame.homeTeamName}</b></div>
              <div className='four columns'>
                <span>{lastGame.result.goalsHomeTeam}</span>
                <span>&nbsp;x&nbsp;</span>
                <span>{lastGame.result.goalsAwayTeam}</span>
              </div>
              <div className='four columns'><b>{lastGame.awayTeamName}</b></div>
            </div>
          ))
        }
    </div>
  )

  const Board = React.createClass({
    getInitialState () {
      return {
        date: '',
        homeTeamUrl: '',
        awayTeamUrl: '',
        lastGames: []
      }
    },

    componentDidMount () {
      axios.get(this.props.url, {
        headers: { 'X-Auth-Token': TOKEN }
      }).then(response => {
        const data = response.data
        for (let i = 0; i < data.count; i++) {
          let date = data.fixtures[i].date
          if (moment().isBefore(date)) {
            this.setState({
              date: date,
              homeTeamUrl: data.fixtures[i]._links.homeTeam.href,
              awayTeamUrl: data.fixtures[i]._links.awayTeam.href
            })
            break
          } else {
            let lastGames = this.state.lastGames
            lastGames.unshift(data.fixtures[i])
            this.setState({lastGames: lastGames.slice(0, 3)})
          }
        }
      })
    },

    render () {
      return (
        <section className='board'>
          <DateDisplay date={this.state.date} />
          <Team isHome url={this.state.homeTeamUrl} />
          &nbsp;x&nbsp;
          <Team url={this.state.awayTeamUrl} />
          <div class='u-cf' />
          <LastGameContainer lastGames={this.state.lastGames} />
        </section>
      )
    }
  })

  ReactDOM.render(
    <Board url='https://api.football-data.org/v1/teams/61/fixtures' />,
    document.getElementById('content')
  )
})()
